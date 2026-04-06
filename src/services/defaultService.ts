import {AuthenticationParameter} from '@lib/authenticator';
import defaultFetcher from '@lib/defaultFetcher';
import {runSafePromise} from '@lib/effectErrorHandler';
import * as Effect from 'effect/Effect';

export type RequestConfig = {
  method: string;
  url: string;
};

export type DefaultServiceParameter<T> = {
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
  ): Effect.Effect<R, Error> {
    const {httpMethod, url, body} = parameter;
    const requestConfig: RequestConfig = {
      method: httpMethod,
      url: `${this.baseUrl}/${url}`,
    };
    const authInfo = this.authInfo;
    return Effect.tryPromise({
      try: () => defaultFetcher<T, R>(authInfo, requestConfig, body),
      catch: error =>
        error instanceof Error ? error : new Error(String(error)),
    });
  }

  protected async request<T, R>(
    parameter: DefaultServiceParameter<T>,
  ): Promise<R> {
    return runSafePromise(this.requestEffect<T, R>(parameter));
  }
}
