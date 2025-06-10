import {DefaultError, ErrorResponse} from '../errors/defaultError';
import getAuthInfo, {AuthenticationParameter} from './authenticator';

type DefaultRequest = {
  url: string;
  method: string;
};

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
  const res = await fetch(request.url, {
    headers: {
      Authorization: authorizationHeaderData,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    method: request.method,
  });

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) {
      const errorResponse = (await res.json()) as ErrorResponse;
      throw new DefaultError(
        errorResponse.errorCode,
        errorResponse.errorMessage,
      );
    } else {
      const responseText = await res.text();
      throw new DefaultError('UnknownError', responseText);
    }
  }

  const responseText = await res.text();
  if (responseText) {
    return JSON.parse(responseText);
  }
  return res.json() as unknown as R;
}
