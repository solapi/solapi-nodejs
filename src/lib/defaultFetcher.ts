import {Data, Effect, Match, Schedule, pipe} from 'effect';
import {
  ApiError,
  DefaultError,
  ErrorResponse,
  NetworkError,
} from '../errors/defaultError';
import getAuthInfo, {AuthenticationParameter} from './authenticator';
import {runSafePromise} from './effectErrorHandler';

type DefaultRequest = {
  url: string;
  method: string;
};

// Effect Data 타입으로 RetryableError 정의
class RetryableError extends Data.TaggedError('RetryableError')<{
  readonly error?: unknown;
}> {}

const handleOkResponse = <R>(res: Response) =>
  Effect.tryPromise({
    try: async (): Promise<R> => {
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : ({} as R);
    },
    catch: e =>
      new DefaultError({
        errorCode: 'ParseError',
        errorMessage: (e as Error).message,
        context: {
          responseStatus: res.status,
          responseUrl: res.url,
        },
      }),
  });

const handleClientErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.json() as Promise<ErrorResponse>,
      catch: e =>
        new DefaultError({
          errorCode: 'ParseError',
          errorMessage: (e as Error).message,
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
    }),
    Effect.flatMap(error =>
      Effect.fail(
        new ApiError({
          errorCode: error.errorCode,
          errorMessage: error.errorMessage,
          httpStatus: res.status,
          url: res.url,
        }),
      ),
    ),
  );

const handleServerErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e =>
        new DefaultError({
          errorCode: 'ResponseReadError',
          errorMessage: (e as Error).message,
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
    }),
    Effect.flatMap(text =>
      Effect.fail(
        new DefaultError({
          errorCode: 'UnknownError',
          errorMessage: text,
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
      ),
    ),
  );

/**
 * 공용 API 클라이언트 함수
 * @throws DefaultError 발송 실패 등 API 상의 다양한 오류를 표시합니다.
 * @param authParameter API 인증을 위한 파라미터
 * @param request API URI, HTTP method 정의
 * @param data API에 요청할 request body 데이터
 */
export default async function defaultFetcher<T, R>(
  authParameter: AuthenticationParameter,
  request: DefaultRequest,
  data?: T,
): Promise<R> {
  const authorizationHeaderData = getAuthInfo(authParameter);

  const effect = pipe(
    Effect.tryPromise({
      try: () =>
        fetch(request.url, {
          headers: {
            Authorization: authorizationHeaderData,
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
          method: request.method,
        }),
      catch: (error: unknown) => {
        if (error instanceof Error) {
          const cause = error.cause;
          const causeCode =
            cause && typeof cause === 'object' && 'code' in cause
              ? String(cause.code)
              : '';
          const message = (error.message + ' ' + causeCode).toLowerCase();

          // 재시도 가능한 네트워크 오류 판별
          const isRetryable =
            message.includes('aborted') ||
            message.includes('refused') ||
            message.includes('reset') ||
            message.includes('econn');

          if (isRetryable) {
            return new RetryableError({error});
          }

          return new NetworkError({
            url: request.url,
            method: request.method,
            cause: error.message,
            isRetryable: false,
          });
        }
        return new NetworkError({
          url: request.url,
          method: request.method,
          cause: String(error),
          isRetryable: false,
        });
      },
    }),
    Effect.flatMap(res =>
      pipe(
        Match.value(res),
        Match.when(
          res => res.status === 503,
          () => Effect.fail(new RetryableError({error: 'Service Unavailable'})),
        ),
        Match.when(
          res => res.status >= 400 && res.status < 500,
          handleClientErrorResponse,
        ),
        Match.when(res => !res.ok, handleServerErrorResponse),
        Match.orElse(handleOkResponse<R>),
      ),
    ),
  );

  const retryCount = 3;

  const policy = pipe(
    Schedule.recurs(retryCount),
    Schedule.whileInput(
      (e: unknown): e is RetryableError => e instanceof RetryableError,
    ),
  );

  const program = pipe(
    effect,
    Effect.retry(policy),
    Effect.catchTag('RetryableError', () =>
      Effect.fail(
        new DefaultError({
          errorCode: 'RequestFailedAfterRetryError',
          errorMessage: `Request failed after retry(count: ${retryCount})`,
          context: {
            url: request.url,
            method: request.method,
            retryCount,
          },
        }),
      ),
    ),
  );

  // runSafePromise를 사용하여 에러 포맷팅 적용
  return runSafePromise(program);
}
