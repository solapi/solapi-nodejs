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
  toString(): string {
    if (process.env.NODE_ENV === 'production') {
      return `${this.errorCode}: ${this.errorMessage}`;
    }
    return `${this.errorCode}: ${this.errorMessage}${
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
  toString(): string {
    return `NetworkError: ${this.method} ${this.url} 요청 실패 - ${this.cause}`;
  }
}

export class ApiError extends Data.TaggedError('ApiError')<{
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly httpStatus: number;
  readonly url?: string;
}> {
  toString(): string {
    return `${this.errorCode}: ${this.errorMessage}`;
  }
}
