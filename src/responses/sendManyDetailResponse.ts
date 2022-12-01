import {GroupMessageResponse} from './messageResponses';

/**
 *
 */
export type FailedMessage = {
  to: string;
  from: string;
  type: string;
  statusMessage: string;
  country: string;
  messageId: string;
  statusCode: string;
  accountId: string;
  customFields?: Map<string, string>;
};

/**
 * @description send 메소드 호출 당시에 showMessageList 값을 true로 넣어서 요청했을 경우 반환되는 응답 데이터
 */
export type MessageListResponse = {
  messageId: string;
  statusCode: string;
  customFields?: Map<string, string>;
  statusMessage: string;
};

/**
 * @description send 메소드 호출 시 반환되는 응답 데이터
 */
export type DetailGroupMessageResponse = {
  /**
   * 메시지 발송 접수에 실패한 메시지 요청 목록들
   * */
  failedMessageList: Array<FailedMessage>;

  /**
   * 발송 정보(성공, 실패 등) 응답 데이터
   */
  groupInfo: GroupMessageResponse;

  /**
   * Send 메소드 호출 당시 showMessageList 값이 true로 되어있을 때 표시되는 메시지 목록
   */
  messageList?: MessageListResponse;
};
