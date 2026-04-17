import {FailedMessage} from '@models/responses/sendManyDetailResponse';
import {Data} from 'effect';

export type ErrorResponse = {
  errorCode: string;
  errorMessage: string;
};

// Effect Data 타입을 활용한 에러 클래스들
export class InvalidDateError extends Data.TaggedError('InvalidDateError')<{
  readonly message: string;
  readonly originalValue?: string;
}> {
  toString(): string {
    return `InvalidDateError: ${this.message}${this.originalValue ? ` (value: ${this.originalValue})` : ''}`;
  }
}

export class ApiKeyError extends Data.TaggedError('ApiKeyError')<{
  readonly message: string;
}> {
  toString(): string {
    return `ApiKeyError: ${this.message}`;
  }
}

export class DefaultError extends Data.TaggedError('DefaultError')<{
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly context?: Record<string, unknown>;
}> {
  get message(): string {
    return `${this.errorCode}: ${this.errorMessage}`;
  }

  toString(): string {
    if (process.env.NODE_ENV === 'production') {
      return this.message;
    }
    return `${this.message}${
      this.context ? `\nContext: ${JSON.stringify(this.context, null, 2)}` : ''
    }`;
  }
}

/**
 * @description 메시지가 모두 발송 접수가 불가한 상태일 경우 MessageNotReceivedError 에러가 발생합니다.
 */
export class MessageNotReceivedError extends Data.TaggedError(
  'MessageNotReceivedError',
)<{
  readonly failedMessageList: ReadonlyArray<FailedMessage>;
  readonly totalCount: number;
}> {
  get message(): string {
    return `${this.totalCount}개의 메시지가 접수되지 못했습니다. 자세한 에러 메시지는 해당 에러 내 failedMessageList를 확인해주세요.`;
  }

  toString(): string {
    return `MessageNotReceivedError: ${this.message}\nFailed messages: ${this.failedMessageList.length}`;
  }
}

export class BadRequestError extends Data.TaggedError('BadRequestError')<{
  readonly message: string;
  readonly validationErrors?: ReadonlyArray<string>;
}> {
  toString(): string {
    return `BadRequestError: ${this.message}${
      this.validationErrors
        ? `\nValidation errors: ${this.validationErrors.join(', ')}`
        : ''
    }`;
  }
}

// 네트워크 관련 에러
export class NetworkError extends Data.TaggedError('NetworkError')<{
  readonly url: string;
  readonly method: string;
  readonly cause: unknown;
  readonly isRetryable?: boolean;
}> {
  get message(): string {
    return `${this.method} ${this.url} 요청 실패 - ${this.cause}`;
  }

  toString(): string {
    return `NetworkError: ${this.message}`;
  }
}

// 4xx 클라이언트 에러용
export class ClientError extends Data.TaggedError('ClientError')<{
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly httpStatus: number;
  readonly url?: string;
}> {
  get message(): string {
    return `${this.errorCode}: ${this.errorMessage}`;
  }

  toString(): string {
    if (process.env.NODE_ENV === 'production') {
      return this.message;
    }
    return `ClientError(${this.httpStatus}): ${this.errorCode} - ${this.errorMessage}\nURL: ${this.url}`;
  }
}

// Defect(예측되지 않은 예외) — Effect 경계에서 발생하는 비정상 에러
export class UnexpectedDefectError extends Data.TaggedError(
  'UnexpectedDefectError',
)<{
  readonly message: string;
}> {
  toString(): string {
    return `UnexpectedDefectError: ${this.message}`;
  }
}

// Effect 실행 실패 (중단 등)
export class UnhandledExitError extends Data.TaggedError('UnhandledExitError')<{
  readonly message: string;
}> {
  toString(): string {
    return `UnhandledExitError: ${this.message}`;
  }
}

/**
 * @description 서버가 2xx로 응답했으나 body가 SDK가 기대하는 스키마를 만족하지 못할 때 발생.
 * 5xx를 의미하지 않으므로 ServerError와 분리하여 소비자의 재시도/알림 분기가 오염되지 않게 한다.
 */
export class ResponseSchemaMismatchError extends Data.TaggedError(
  'ResponseSchemaMismatchError',
)<{
  readonly message: string;
  readonly url?: string;
  readonly validationErrors: ReadonlyArray<string>;
  readonly responseBody?: string;
}> {
  toString(): string {
    const header = `ResponseSchemaMismatchError: ${this.message}`;
    const url = this.url ? `\nURL: ${this.url}` : '';
    const issues =
      this.validationErrors.length > 0
        ? `\nIssues:\n- ${this.validationErrors.join('\n- ')}`
        : '';
    // url과 validationErrors는 민감 정보가 아니고 운영 디버깅에 필수적이므로 production에서도 유지.
    // responseBody만 민감 페이로드일 수 있어 production에서 제외.
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      return `${header}${url}${issues}`;
    }
    const body = this.responseBody
      ? `\nResponse: ${this.responseBody.substring(0, 500)}`
      : '';
    return `${header}${url}${issues}${body}`;
  }
}

// 5xx 서버 에러용
export class ServerError extends Data.TaggedError('ServerError')<{
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly httpStatus: number;
  readonly url?: string;
  readonly responseBody?: string;
}> {
  get message(): string {
    return `${this.errorCode} - ${this.errorMessage}`;
  }

  toString(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      return `ServerError(${this.httpStatus}): ${this.message}`;
    }
    return `ServerError(${this.httpStatus}): ${this.message}
URL: ${this.url}
Response: ${this.responseBody?.substring(0, 500) ?? '(empty)'}`;
  }
}

export const isErrorResponse = (value: unknown): value is ErrorResponse => {
  if (value == null || typeof value !== 'object') return false;
  if (!('errorCode' in value) || !('errorMessage' in value)) return false;
  return (
    typeof value.errorCode === 'string' &&
    value.errorCode !== '' &&
    typeof value.errorMessage === 'string' &&
    value.errorMessage !== ''
  );
};
