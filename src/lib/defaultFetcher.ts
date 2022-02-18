import getAuthInfo, {AuthenticationParameter} from './authenticator';
import fetch from 'cross-fetch';
import {DefaultError, ErrorResponse} from '../errors/DefaultError';

type Request = {
    url: string,
    method: string
}

export default async function defaultFetcher<T, R>(authParameter: AuthenticationParameter, request: Request, data?: T): Promise<R> {
    const authorizationHeaderData = getAuthInfo(authParameter);
    return await fetch(request.url, {
        headers: {
            'Authorization': authorizationHeaderData,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        method: request.method
    }).then<R>(async (res) => {
        if (res.status >= 400 || res.status < 500) {
            const errorResponse: ErrorResponse = await res.json();
            throw new DefaultError(errorResponse.errorCode, errorResponse.errorMessage);
        } else if (res.status >= 500) {
            const responseText = await res.text();
            throw new DefaultError('UnknownException', responseText);
        }
        return res.json();
    });
}
