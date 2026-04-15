#!/usr/bin/env bash

set -euo pipefail

workflow_file="${1:?workflow file is required}"
branch_name="${2:?branch name is required}"
commit_sha="${3:?commit sha is required}"
poll_seconds="${4:-10}"
max_attempts="${5:-60}"

echo "Waiting for ${workflow_file} on ${branch_name}@${commit_sha}"

for attempt in $(seq 1 "${max_attempts}"); do
  run_json="$(
    gh run list \
      --workflow "${workflow_file}" \
      --branch "${branch_name}" \
      --commit "${commit_sha}" \
      --event push \
      --limit 20 \
      --json databaseId,headSha,status,conclusion \
      --jq 'map(select(.headSha == "'"${commit_sha}"'")) | first'
  )"

  if [[ -z "${run_json}" || "${run_json}" == "null" ]]; then
    echo "Attempt ${attempt}/${max_attempts}: workflow run not found yet."
    sleep "${poll_seconds}"
    continue
  fi

  run_id="$(jq -r '.databaseId' <<<"${run_json}")"
  run_status="$(jq -r '.status' <<<"${run_json}")"
  run_conclusion="$(jq -r '.conclusion // empty' <<<"${run_json}")"

  echo "Attempt ${attempt}/${max_attempts}: run=${run_id} status=${run_status} conclusion=${run_conclusion:-pending}"

  if [[ "${run_status}" != "completed" ]]; then
    sleep "${poll_seconds}"
    continue
  fi

  if [[ "${run_conclusion}" == "success" ]]; then
    echo "${workflow_file} succeeded for ${commit_sha}"
    exit 0
  fi

  echo "${workflow_file} concluded with ${run_conclusion} for ${commit_sha}"
  exit 1
done

echo "Timed out while waiting for ${workflow_file} on ${commit_sha}"
exit 1
