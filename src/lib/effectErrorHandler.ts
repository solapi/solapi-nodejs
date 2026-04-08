import {Cause, Chunk, Effect, Exit} from 'effect';

/**
 * Defect(예측되지 않은 에러)에서 정보 추출
 */
const extractDefectInfo = (
  defect: unknown,
): {summary: string; details: string} => {
  if (defect && typeof defect === 'object' && '_tag' in defect) {
    const tag = (defect as {_tag: string})._tag;
    const message =
      'message' in defect ? String((defect as {message: unknown}).message) : '';
    return {
      summary: `${tag}${message ? `: ${message}` : ''}`,
      details: `Tagged Error [${tag}]: ${JSON.stringify(defect, null, 2)}`,
    };
  }

  if (defect !== null && typeof defect === 'object') {
    const keys = Object.keys(defect);
    const summary =
      keys.length > 0
        ? `Object with keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`
        : 'Empty object';
    return {
      summary,
      details: JSON.stringify(defect, null, 2),
    };
  }

  return {
    summary: String(defect),
    details: `Value (${typeof defect}): ${String(defect)}`,
  };
};

/**
 * Cause에서 throw/reject할 에러를 추출.
 * 예측된 실패 → 원본 Effect 에러, Defect → 래핑된 Error
 */
const unwrapCause = (cause: Cause.Cause<unknown>): unknown => {
  const failure = Cause.failureOption(cause);
  if (failure._tag === 'Some') {
    return failure.value;
  }

  const defects = Cause.defects(cause);
  if (defects.length > 0) {
    const firstDefect = Chunk.unsafeGet(defects, 0);
    if (firstDefect instanceof Error) {
      return firstDefect;
    }
    const isProduction = process.env.NODE_ENV === 'production';
    const defectInfo = extractDefectInfo(firstDefect);
    const message = isProduction
      ? `Unexpected error: ${defectInfo.summary}`
      : `Unexpected error: ${defectInfo.details}\nCause: ${Cause.pretty(cause)}`;
    const error = new Error(message);
    error.name = 'UnexpectedDefectError';
    return error;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction
    ? 'Effect execution failed unexpectedly'
    : `Unhandled Effect Exit:\n${Cause.pretty(cause)}`;
  const error = new Error(message);
  error.name = 'UnhandledExitError';
  return error;
};

export const runSafeSync = <E, A>(effect: Effect.Effect<A, E>): A => {
  const exit = Effect.runSyncExit(effect);
  return Exit.match(exit, {
    onFailure: cause => {
      throw unwrapCause(cause);
    },
    onSuccess: value => value,
  });
};

// Promise로 Effect 실행 — 예측된 실패는 원본 Effect 에러 그대로 reject
export const runSafePromise = <E, A>(
  effect: Effect.Effect<A, E>,
): Promise<A> => {
  return Effect.runPromiseExit(effect).then(
    Exit.match({
      onFailure: cause => Promise.reject(unwrapCause(cause)),
      onSuccess: value => Promise.resolve(value),
    }),
  );
};
