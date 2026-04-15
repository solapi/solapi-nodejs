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

type DefaultRequest = {
  url: string;
  method: string;
};

class RetryableError extends Data.TaggedError('RetryableError')<{
  readonly error?: unknown;
}> {}

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);

const makeParseError = (res: Response, message: string) =>
  new DefaultError({
    errorCode: 'ParseError',
    errorMessage: message,
    context: {responseStatus: res.status, responseUrl: res.url},
  });

const handleOkResponse = <R>(res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e => makeParseError(res, toMessage(e)),
    }),
    Effect.flatMap(responseText => {
      if (!responseText) {
        if (res.status === 204) {
          return Effect.succeed({} as unknown as R);
        }
        return Effect.fail(
          makeParseError(res, 'API returned empty response body'),
        );
      }
      return Effect.try({
        try: (): R => {
          const parsed: unknown = JSON.parse(responseText);
          return parsed as R;
        },
        catch: e => makeParseError(res, toMessage(e)),
      });
    }),
  );

const handleClientErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e => makeParseError(res, toMessage(e)),
    }),
    Effect.flatMap(text => {
      const genericError = new ClientError({
        errorCode: `HTTP_${res.status}`,
        errorMessage: text.substring(0, 200) || 'Client error occurred',
        httpStatus: res.status,
        url: res.url,
      });

      return Effect.flatMap(
        Effect.try({
          try: () => JSON.parse(text) as unknown,
          catch: (e: unknown) =>
            e instanceof SyntaxError
              ? genericError
              : new ClientError({
                  errorCode: 'ResponseParseError',
                  errorMessage: toMessage(e),
                  httpStatus: res.status,
                  url: res.url,
                }),
        }),
        json =>
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
  return Effect.flatMap(
    Effect.try({
      try: () => JSON.parse(text) as unknown,
      catch: (e: unknown) =>
        e instanceof SyntaxError
          ? genericError
          : makeError('ResponseParseError', toMessage(e)),
    }),
    json =>
      Effect.fail(
        isErrorResponse(json)
          ? makeError(json.errorCode, json.errorMessage)
          : genericError,
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
          errorMessage: toMessage(e),
          context: {responseStatus: res.status, responseUrl: res.url},
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
          errorMessage: toMessage(e),
          context: {data},
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
