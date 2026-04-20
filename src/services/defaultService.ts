import {AuthenticationParameter} from '@lib/authenticator';
import {defaultFetcherEffect} from '@lib/defaultFetcher';
import {runSafePromise} from '@lib/effectErrorHandler';
import {
  decodeServerResponse,
  decodeWithBadRequest,
  safeFinalize,
} from '@lib/schemaUtils';
import stringifyQuery from '@lib/stringifyQuery';
import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import type {
  ApiKeyError,
  BadRequestError,
  ClientError,
  DefaultError,
  InvalidDateError,
  NetworkError,
  ResponseSchemaMismatchError,
  ServerError,
} from '../errors/defaultError';

type RequestConfig = {
  method: string;
  url: string;
};

type DefaultServiceParameter<T, R = unknown, I = unknown> = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: T;
  /**
   * 2xx 응답 body에 대해 실행되는 런타임 검증 스키마.
   * Schema.decodeUnknown은 requirement 채널을 요구하지 않도록 never로 고정 —
   * 외부 의존성이 필요한 transform은 허용하지 않아 디코딩 결과가 항상 pure해진다.
   */
  responseSchema?: Schema.Schema<R, I, never>;
};

export default class DefaultService {
  private readonly baseUrl = 'https://api.solapi.com';
  private readonly authInfo: AuthenticationParameter;

  constructor(apiKey: string, apiSecret: string) {
    this.authInfo = {
      apiKey,
      apiSecret,
    };
  }

  protected requestEffect<T, R, I = unknown>(
    parameter: DefaultServiceParameter<T, R, I>,
  ): Effect.Effect<
    R,
    | ApiKeyError
    | ClientError
    | ServerError
    | NetworkError
    | DefaultError
    | ResponseSchemaMismatchError
  > {
    const {httpMethod, url, body, responseSchema} = parameter;
    const requestConfig: RequestConfig = {
      method: httpMethod,
      url: `${this.baseUrl}/${url}`,
    };
    if (responseSchema) {
      return Effect.flatMap(
        defaultFetcherEffect<T, unknown>(this.authInfo, requestConfig, body),
        data =>
          decodeServerResponse(responseSchema, data, {url: requestConfig.url}),
      );
    }
    return defaultFetcherEffect<T, R>(this.authInfo, requestConfig, body);
  }

  protected async request<T, R, I = unknown>(
    parameter: DefaultServiceParameter<T, R, I>,
  ): Promise<R> {
    return runSafePromise(this.requestEffect<T, R, I>(parameter));
  }

  protected getWithQuery<A, R, I = unknown>(config: {
    schema: Schema.Schema<A>;
    finalize: (validated?: A) => object;
    url: string;
    data?: unknown;
    responseSchema?: Schema.Schema<R, I, never>;
  }): Effect.Effect<
    R,
    | ApiKeyError
    | ClientError
    | ServerError
    | NetworkError
    | DefaultError
    | BadRequestError
    | InvalidDateError
    | ResponseSchemaMismatchError
  > {
    const reqEffect = this.requestEffect.bind(this);
    return Effect.gen(function* () {
      const validated = config.data
        ? yield* decodeWithBadRequest(config.schema, config.data)
        : undefined;
      const payload = yield* safeFinalize(() => config.finalize(validated));
      const parameter = stringifyQuery(payload, {
        indices: false,
        addQueryPrefix: true,
      });
      return yield* reqEffect<never, R, I>({
        httpMethod: 'GET',
        url: `${config.url}${parameter}`,
        responseSchema: config.responseSchema,
      });
    });
  }
}
