import {FailedMessage} from '@models/responses/sendManyDetailResponse';

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
  failedMessageList: Array<FailedMessage>;

  constructor(errorList: Array<FailedMessage>) {
    const statusMessageCount = errorList.length;
    super(
      `${statusMessageCount}개의 메시지가 접수되지 못했습니다. 자세한 에러 메시지는 해당 에러 내 failedMessageList를 확인해주세요.`,
    );
    this.name = 'MessagesNotReceivedError';
    this.failedMessageList = errorList;
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}
