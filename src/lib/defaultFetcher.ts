import {Effect, Match, Schedule, pipe} from 'effect';
import {DefaultError, ErrorResponse} from '../errors/defaultError';
import getAuthInfo, {AuthenticationParameter} from './authenticator';

type DefaultRequest = {
  url: string;
  method: string;
};

class RetryableError {
  readonly _tag = 'RetryableError';
  constructor(readonly error?: unknown) {}
}

const handleOkResponse = <R>(res: Response) =>
  Effect.tryPromise({
    try: async (): Promise<R> => {
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : ({} as R);
    },
    catch: e => new DefaultError('ParseError', (e as Error).message),
  });

const handleClientErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.json() as Promise<ErrorResponse>,
      catch: e => new DefaultError('ParseError', (e as Error).message),
    }),
    Effect.flatMap(error =>
      Effect.fail(new DefaultError(error.errorCode, error.errorMessage)),
    ),
  );

const handleServerErrorResponse = (res: Response) =>
  pipe(
    Effect.tryPromise({
      try: () => res.text(),
      catch: e => new DefaultError('ResponseReadError', (e as Error).message),
    }),
    Effect.flatMap(text => Effect.fail(new DefaultError('UnknownError', text))),
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
          if (
            message.includes('aborted') ||
            message.includes('refused') ||
            message.includes('reset') ||
            message.includes('econn')
          ) {
            return new RetryableError(error);
          }
          return new DefaultError('RequestError', error.message);
        }
        return new DefaultError('UnknownRequestError', String(error));
      },
    }),
    Effect.flatMap(res =>
      pipe(
        Match.value(res),
        Match.when(
          res => res.status === 503,
          () => Effect.fail(new RetryableError()),
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
        new DefaultError(
          'RequestFailedAfterRetryError',
          `Request failed after retry(count: ${retryCount})`,
        ),
      ),
    ),
  );

  return Effect.runPromise(program);
}
