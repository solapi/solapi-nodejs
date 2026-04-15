import {Cause, Chunk, Effect, Exit} from 'effect';
import {
  UnexpectedDefectError,
  UnhandledExitError,
} from '../errors/defaultError';

const isTaggedDefect = (
  value: unknown,
): value is {readonly _tag: string; readonly message?: unknown} =>
  value !== null &&
  typeof value === 'object' &&
  '_tag' in value &&
  typeof value._tag === 'string';

/**
 * Defect(예측되지 않은 에러)에서 정보 추출
 */
const extractDefectInfo = (
  defect: unknown,
): {summary: string; details: string} => {
  if (isTaggedDefect(defect)) {
    const tag = defect._tag;
    const message = defect.message != null ? String(defect.message) : '';
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
 * 예측된 실패 → 원본 Effect 에러, Defect → Data.TaggedError
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
    return new UnexpectedDefectError({message});
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction
    ? 'Effect execution failed unexpectedly'
    : `Unhandled Effect Exit:\n${Cause.pretty(cause)}`;
  return new UnhandledExitError({message});
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
