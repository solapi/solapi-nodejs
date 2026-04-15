import {AuthenticationParameter} from '@lib/authenticator';
import {defaultFetcherEffect} from '@lib/defaultFetcher';
import {runSafePromise} from '@lib/effectErrorHandler';
import {decodeWithBadRequest, safeFinalize} from '@lib/schemaUtils';
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
  ServerError,
} from '../errors/defaultError';

type RequestConfig = {
  method: string;
  url: string;
};

type DefaultServiceParameter<T> = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: T;
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

  protected requestEffect<T, R>(
    parameter: DefaultServiceParameter<T>,
  ): Effect.Effect<
    R,
    ApiKeyError | ClientError | ServerError | NetworkError | DefaultError
  > {
    const {httpMethod, url, body} = parameter;
    const requestConfig: RequestConfig = {
      method: httpMethod,
      url: `${this.baseUrl}/${url}`,
    };
    return defaultFetcherEffect<T, R>(this.authInfo, requestConfig, body);
  }

  protected async request<T, R>(
    parameter: DefaultServiceParameter<T>,
  ): Promise<R> {
    return runSafePromise(this.requestEffect<T, R>(parameter));
  }

  protected getWithQuery<A, R>(config: {
    schema: Schema.Schema<A>;
    finalize: (validated?: A) => object;
    url: string;
    data?: unknown;
  }): Effect.Effect<
    R,
    | ApiKeyError
    | ClientError
    | ServerError
    | NetworkError
    | DefaultError
    | BadRequestError
    | InvalidDateError
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
      return yield* reqEffect<never, R>({
        httpMethod: 'GET',
        url: `${config.url}${parameter}`,
      });
    });
  }
}
