/**
 * 테스트용 재시도 유틸리티
 * API eventual consistency 문제를 해결하기 위한 재시도 로직 제공
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 5,
  initialDelayMs: 100,
  maxDelayMs: 2000,
  backoffMultiplier: 2,
};

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 지수 백오프를 사용한 재시도 함수
 * @param fn 실행할 비동기 함수
 * @param options 재시도 옵션
 * @returns 함수 실행 결과
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = {...DEFAULT_OPTIONS, ...options};
  let lastError: Error | undefined;
  let delay = opts.initialDelayMs;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < opts.maxRetries) {
        await sleep(delay);
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
      }
    }
  }

  throw lastError;
}

/**
 * 특정 조건이 충족될 때까지 재시도
 * @param fn 실행할 비동기 함수
 * @param predicate 조건 검사 함수
 * @param options 재시도 옵션
 * @returns 조건을 충족한 결과
 */
export async function retryUntil<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: RetryOptions = {},
): Promise<T> {
  const opts = {...DEFAULT_OPTIONS, ...options};
  let delay = opts.initialDelayMs;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    const result = await fn();

    if (predicate(result)) {
      return result;
    }

    if (attempt < opts.maxRetries) {
      await sleep(delay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }
  }

  throw new Error(`Condition not met after ${opts.maxRetries + 1} attempts`);
}
