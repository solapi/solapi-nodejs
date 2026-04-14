import {AuthenticationParameter} from '@lib/authenticator';
import {defaultFetcherEffect} from '@lib/defaultFetcher';
import {runSafePromise} from '@lib/effectErrorHandler';
import * as Effect from 'effect/Effect';
import type {
  ApiKeyError,
  ClientError,
  DefaultError,
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
}
