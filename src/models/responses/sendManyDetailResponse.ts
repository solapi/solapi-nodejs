import {Schema} from 'effect';
import {groupMessageResponseSchema} from './messageResponses';

/**
 * @description 메시지 접수에 실패한 메시지 객체
 */
export const failedMessageSchema = Schema.Struct({
  to: Schema.String,
  from: Schema.String,
  type: Schema.String,
  statusMessage: Schema.String,
  country: Schema.String,
  messageId: Schema.String,
  statusCode: Schema.String,
  accountId: Schema.String,
  customFields: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
});
export type FailedMessage = Schema.Schema.Type<typeof failedMessageSchema>;

/**
 * @description send 메소드 호출 당시에 showMessageList 값을 true로 넣어서 요청했을 경우 반환되는 응답 데이터
 */
export const messageResponseItemSchema = Schema.Struct({
  messageId: Schema.String,
  statusCode: Schema.String,
  customFields: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  statusMessage: Schema.String,
});
export type MessageResponseItem = Schema.Schema.Type<
  typeof messageResponseItemSchema
>;

/**
 * @description send 메소드 호출 시 반환되는 응답 데이터
 */
export const detailGroupMessageResponseSchema = Schema.Struct({
  /**
   * 메시지 발송 접수에 실패한 메시지 요청 목록들
   */
  failedMessageList: Schema.Array(failedMessageSchema),

  /**
   * 발송 정보(성공, 실패 등) 응답 데이터
   */
  groupInfo: groupMessageResponseSchema,

  /**
   * Send 메소드 호출 당시 showMessageList 값이 true로 되어있을 때 표시되는 메시지 목록
   */
  messageList: Schema.optional(Schema.Array(messageResponseItemSchema)),
});
export type DetailGroupMessageResponse = Schema.Schema.Type<
  typeof detailGroupMessageResponseSchema
>;
