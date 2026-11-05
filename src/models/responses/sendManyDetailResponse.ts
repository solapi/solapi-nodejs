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

// 고속접수(send-many/fast) 응답은 폐기된 친구톡(cta/cti) 과금 필드를 내려주지 않으므로
// 기존 send-many/detail 응답 계약 유지를 위해 빈 값으로 채운다.
export const withFastSendDefaults = (
  response: DetailGroupMessageResponse,
): DetailGroupMessageResponse => {
  const {groupInfo} = response;
  const {countForCharge, app} = groupInfo;
  return {
    ...response,
    groupInfo: {
      ...groupInfo,
      isRefunded: groupInfo.isRefunded ?? false,
      countForCharge: {
        ...countForCharge,
        cta: countForCharge.cta ?? {},
        cti: countForCharge.cti ?? {},
      },
      app: {
        ...app,
        profit: {
          ...app.profit,
          cta: app.profit.cta ?? 0,
          cti: app.profit.cti ?? 0,
        },
      },
    },
  };
};
