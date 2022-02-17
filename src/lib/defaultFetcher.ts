import getAuthInfo, {AuthenticationParameter} from './authenticator';
import fetch from 'cross-fetch';

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
    }).then<R>(res => res.json());
}
