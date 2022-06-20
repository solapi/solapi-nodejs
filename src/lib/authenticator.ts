import {customAlphabet} from 'nanoid';
import {formatISO} from 'date-fns';
import {HmacSHA256} from 'crypto-js';
import {ApiKeyError} from '../errors/DefaultError';

enum AuthenticateType {
    API_KEY
}

export type AuthenticationParameter = {
    apiKey?: string
    apiSecret?: string
}


/**
 * Get Authenticate Information for SOLAPI Requests
 * @param authenticationParameter
 * @param authType
 * @return string Authorization value
 */
export default function getAuthInfo(authenticationParameter: AuthenticationParameter, authType: AuthenticateType = AuthenticateType.API_KEY): string {
    const {apiKey, apiSecret} = authenticationParameter;
    switch (authType) {
        case AuthenticateType.API_KEY:
        default:
            const salt = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)();
            const date = formatISO(new Date());
            const hmacData = date + salt;
            if ((!apiKey || !apiSecret) || (apiKey === '' || apiSecret === '')) {
                throw new ApiKeyError('Invalid API Key Error');
            }
            const signature = HmacSHA256(hmacData, apiSecret).toString();
            return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
    }
}
