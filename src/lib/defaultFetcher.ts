import {Data, Effect, Match, pipe, Schedule} from 'effect';
import {
  ApiKeyError,
  ClientError,
  DefaultError,
  isErrorResponse,
  NetworkError,
  ServerError,
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
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e =>
        new DefaultError({
          errorCode: 'ParseError',
          errorMessage: e instanceof Error ? e.message : String(e),
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
    }),
    Effect.flatMap(responseText => {
      if (!responseText) {
        if (res.status === 204) {
          return Effect.succeed({} as R);
        }
        return Effect.fail(
          new DefaultError({
            errorCode: 'ParseError',
            errorMessage: 'API returned empty response body',
            context: {
              responseStatus: res.status,
              responseUrl: res.url,
            },
          }),
        );
      }
      return Effect.try({
        try: () => JSON.parse(responseText) as R,
        catch: e =>
          new DefaultError({
            errorCode: 'ParseError',
            errorMessage: e instanceof Error ? e.message : String(e),
            context: {
              responseStatus: res.status,
              responseUrl: res.url,
            },
          }),
      });
    }),
  );

const handleClientErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e =>
        new DefaultError({
          errorCode: 'ParseError',
          errorMessage: e instanceof Error ? e.message : String(e),
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
    }),
    Effect.flatMap(text => {
      const genericError = new ClientError({
        errorCode: `HTTP_${res.status}`,
        errorMessage: text.substring(0, 200) || 'Client error occurred',
        httpStatus: res.status,
        url: res.url,
      });

      return pipe(
        Effect.try({
          try: () => JSON.parse(text) as unknown,
          catch: () => genericError,
        }),
        Effect.flatMap(json =>
          Effect.fail(
            isErrorResponse(json)
              ? new ClientError({
                  errorCode: json.errorCode,
                  errorMessage: json.errorMessage,
                  httpStatus: res.status,
                  url: res.url,
                })
              : genericError,
          ),
        ),
      );
    }),
  );

/**
 * JSON 파싱을 시도하여 적절한 ServerError로 실패하는 Effect를 반환.
 * 모든 경로가 ServerError로 실패한다 (서버 에러 응답이므로 성공 경로 없음).
 */
function parseServerErrorBody(
  text: string,
  genericError: ServerError,
  makeError: (errorCode: string, errorMessage: string) => ServerError,
): Effect.Effect<never, ServerError> {
  return pipe(
    Effect.try({
      try: () => JSON.parse(text) as unknown,
      catch: (parseError: unknown) =>
        parseError instanceof SyntaxError
          ? genericError
          : makeError(
              'ResponseParseError',
              parseError instanceof Error
                ? parseError.message
                : String(parseError),
            ),
    }),
    Effect.flatMap(json =>
      Effect.fail(
        isErrorResponse(json)
          ? makeError(json.errorCode, json.errorMessage)
          : genericError,
      ),
    ),
  );
}

const handleServerErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e =>
        new DefaultError({
          errorCode: 'ResponseReadError',
          errorMessage: e instanceof Error ? e.message : String(e),
          context: {
            responseStatus: res.status,
            responseUrl: res.url,
          },
        }),
    }),
    Effect.flatMap(text => {
      const isProduction = process.env.NODE_ENV === 'production';
      const makeError = (
        errorCode: string,
        errorMessage: string,
      ): ServerError =>
        new ServerError({
          errorCode,
          errorMessage,
          httpStatus: res.status,
          url: res.url,
          responseBody: isProduction ? undefined : text,
        });

      const genericError = makeError(
        `HTTP_${res.status}`,
        text.substring(0, 200) || 'Server error occurred',
      );

      return parseServerErrorBody(text, genericError, makeError);
    }),
  );

/**
 * raw Effect를 반환하는 API 클라이언트 함수 (서비스 레이어에서 Effect 합성용)
 */
export function defaultFetcherEffect<T, R>(
  authParameter: AuthenticationParameter,
  request: DefaultRequest,
  data?: T,
): Effect.Effect<
  R,
  ApiKeyError | ClientError | ServerError | NetworkError | DefaultError
> {
  const effect = Effect.gen(function* () {
    const authorizationHeaderData = yield* getAuthInfo(authParameter);

    const body = yield* Effect.try({
      try: () => (data ? JSON.stringify(data) : undefined),
      catch: e =>
        new DefaultError({
          errorCode: 'JSONStringifyError',
          errorMessage: e instanceof Error ? e.message : String(e),
          context: {
            data,
          },
        }),
    });

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(request.url, {
          headers: {
            Authorization: authorizationHeaderData,
            'Content-Type': 'application/json',
          },
          body,
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
    });

    return yield* pipe(
      Match.value(response),
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
    );
  });

  const retryCount = 3;

  const policy = pipe(
    Schedule.recurs(retryCount),
    Schedule.whileInput(
      (e: unknown): e is RetryableError => e instanceof RetryableError,
    ),
  );

  return pipe(
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
}

/**
 * 공용 API 클라이언트 함수 (Promise 반환)
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
  return runSafePromise(
    defaultFetcherEffect<T, R>(authParameter, request, data),
  );
}
