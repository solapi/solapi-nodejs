import {promises as fs} from 'node:fs';
import {URL} from 'node:url';
import * as Effect from 'effect/Effect';

// 내부 유틸: 주어진 문자열이 http(s) 스킴의 URL 인지 판별
const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// URL → Base64 변환
const fromUrl = (url: string) =>
  Effect.flatMap(
    Effect.tryPromise({
      try: () => fetch(url),
      catch: error =>
        new Error(
          `네트워크 오류로 URL(${url})을(를) 가져오지 못했습니다.\n${error}`,
        ),
    }),
    response => {
      if (!response.ok) {
        return Effect.fail(
          new Error(
            `URL(${url}) 요청 실패 – 상태 코드: ${response.status} ${response.statusText}`,
          ),
        );
      }
      return Effect.tryPromise({
        try: () => response.arrayBuffer(),
        catch: error =>
          new Error(`응답 body 처리 중 오류가 발생했습니다.\n${error}`),
      });
    },
  ).pipe(
    Effect.map(arrayBuffer => Buffer.from(arrayBuffer).toString('base64')),
  );

// 파일 경로 → Base64 변환
const fromPath = (path: string) =>
  Effect.tryPromise({
    try: () => fs.readFile(path),
    catch: error => new Error(`파일을 읽을 수 없습니다: ${path}\n${error}`),
  }).pipe(Effect.map(buffer => buffer.toString('base64')));

/**
 * 주어진 경로(URL 또는 로컬 경로)의 파일을 Base64 문자열로 변환합니다.
 * – http(s) URL 인 경우 네트워크로 가져오고, 그 외는 로컬 파일로 처리합니다.
 * – 오류는 명확하게 구분하여 반환합니다.
 * @param path 파일의 로컬 경로 또는 접근 가능한 URL
 * @returns Base64 문자열
 */
export default async function fileToBase64(path: string): Promise<string> {
  const program = isHttpUrl(path) ? fromUrl(path) : fromPath(path);
  return Effect.runPromise(program);
}
