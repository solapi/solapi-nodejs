import {createHmac, randomBytes} from 'crypto';
import {formatISO} from 'date-fns';
import {Effect} from 'effect';
import {ApiKeyError, DefaultError} from '../errors/defaultError';

enum AuthenticateType {
  API_KEY,
}

export type AuthenticationParameter = {
  apiKey: string;
  apiSecret: string;
};

/**
 * 특정 사이즈의 텍스트를 생성합니다.
 * @param alphabet 지정할 알파벳/숫자 문자열
 * @param size 지정할 문자 길이
 */
function genCustomText(alphabet: string, size: number): string {
  const bytes = randomBytes(size);
  let genRandomText = '';
  for (let i = 0; i < size; i++) {
    genRandomText += alphabet[bytes[i] % alphabet.length];
  }
  return genRandomText;
}

/**
 * Get Authenticate Information for SOLAPI Requests
 * @param authenticationParameter
 * @param authType
 * @return Effect<string, ApiKeyError> Authorization value
 */
export default function getAuthInfo(
  authenticationParameter: AuthenticationParameter,
  authType: AuthenticateType = AuthenticateType.API_KEY,
): Effect.Effect<string, ApiKeyError | DefaultError> {
  const {apiKey, apiSecret} = authenticationParameter;
  switch (authType) {
    case AuthenticateType.API_KEY:
    default:
      if (!apiKey || !apiSecret) {
        return Effect.fail(
          new ApiKeyError({message: 'API Key와 API Secret은 필수입니다.'}),
        );
      }
      return Effect.try({
        try: () => {
          const salt = genCustomText(
            '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            32,
          );
          const date = formatISO(new Date());
          const hmacData = date + salt;
          const genHmac = createHmac('sha256', apiSecret);
          genHmac.update(hmacData);
          const signature = genHmac.digest('hex');
          return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
        },
        catch: e =>
          new DefaultError({
            errorCode: 'AuthError',
            errorMessage: e instanceof Error ? e.message : String(e),
          }),
      });
  }
}
