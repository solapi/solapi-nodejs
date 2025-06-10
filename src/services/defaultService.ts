import {AuthenticationParameter} from '../lib/authenticator';
import defaultFetcher from '../lib/defaultFetcher';
import {RequestConfig} from '../models/requests/messageRequest';

type DefaultServiceParameter<T> = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
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

  protected async request<T, R>(
    parameter: DefaultServiceParameter<T>,
  ): Promise<R> {
    const {httpMethod, url, body} = parameter;
    const requestConfig: RequestConfig = {
      method: httpMethod,
      url: `${this.baseUrl}/${url}`,
    };
    return defaultFetcher<T, R>(this.authInfo, requestConfig, body);
  }
}
