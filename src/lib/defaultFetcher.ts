import getAuthInfo, {AuthenticationParameter} from './authenticator';
import fetch from 'cross-fetch';
import {DefaultError, ErrorResponse} from '../errors/DefaultError';

type DefaultRequest = {
    url: string,
    method: string
}

/**
 * 공용 API 클라이언트 함수
 * @throws DefaultError 발송 실패 등 API 상의 다양한 오류를 표시합니다.
 * @param authParameter API 인증을 위한 파라미터
 * @param request API URI, HTTP method 정의
 * @param data API에 요청할 request body 데이터
 */
export default async function defaultFetcher<T, R>(authParameter: AuthenticationParameter, request: DefaultRequest, data?: T): Promise<R> {
    const authorizationHeaderData = getAuthInfo(authParameter);
    return await fetch(request.url, {
        headers: {
            'Authorization': authorizationHeaderData,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: request.method
    }).then<R>(async (res) => {
        if (res.status >= 400 && res.status < 500) {
            const errorResponse: ErrorResponse = await res.json();
            throw new DefaultError(errorResponse.errorCode, errorResponse.errorMessage);
        } else if (res.status >= 500) {
            const responseText = await res.text();
            throw new DefaultError('UnknownException', responseText);
        }
        try {
            return res.json();
        } catch (exception) {
            throw new Error(await res.text());
        }
    });
}
