import {FailedMessage} from '../responses/sendManyDetailResponse';

export type ErrorResponse = {
  errorCode: string;
  errorMessage: string;
};

export class InvalidDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDateError';
  }
}

export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidApiKeyError';
  }
}

export class DefaultError extends Error {
  constructor(errorCode: string, errorMessage: string) {
    super(errorMessage);
    this.name = errorCode;
  }
}

/**
 * @description 메시지가 모두 발송 접수가 불가한 상태일 경우 MessageNotReceivedError 에러가 발생합니다.
 */
export class MessageNotReceivedError extends Error {
  constructor(errorList: Array<FailedMessage>) {
    super(JSON.stringify(errorList));
    this.name = 'MessagesNotReceivedError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}
