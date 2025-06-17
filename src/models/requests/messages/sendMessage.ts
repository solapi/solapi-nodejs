import {messageSchema} from '@models/base/messages/message';
import {Schema} from 'effect';
import {defaultAgentTypeSchema} from './requestConfig';

/**
 * 단건 메시지 발송 요청 모델
 * @description 단건 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 * ```
 */
export const requestSendOneMessageSchema = messageSchema;

/**
 * 메시지 발송 요청 모델
 * @description 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 *
 * // 혹은..
 * const messages = [
 *  {
 *    to: '01012345678',
 *    from: '01012345678',
 *    text: 'Hello, world!',
 *  },
 * ];
 * ```
 */
export const requestSendMessageSchema = Schema.Union(
  requestSendOneMessageSchema,
  Schema.Array(requestSendOneMessageSchema),
);

export type RequestSendOneMessageSchema = Schema.Schema.Type<
  typeof requestSendOneMessageSchema
>;

export type RequestSendMessagesSchema = Schema.Schema.Type<
  typeof requestSendMessageSchema
>;

// 기본 Agent 객체 (sdkVersion, osPlatform 값 포함) – 빈 객체 디코딩으로 생성
const defaultAgentValue = Schema.decodeSync(defaultAgentTypeSchema)({});

export const singleMessageSendingRequestSchema = Schema.Struct({
  message: requestSendOneMessageSchema,
  agent: Schema.optional(defaultAgentTypeSchema).pipe(
    Schema.withDecodingDefault(() => defaultAgentValue),
    Schema.withConstructorDefault(() => defaultAgentValue),
  ),
});

export const multipleMessageSendingRequestSchema = Schema.Struct({
  allowDuplicates: Schema.optional(Schema.Boolean),
  agent: Schema.optional(defaultAgentTypeSchema).pipe(
    Schema.withDecodingDefault(() => defaultAgentValue),
    Schema.withConstructorDefault(() => defaultAgentValue),
  ),
  messages: Schema.Array(requestSendOneMessageSchema),
  scheduledDate: Schema.optional(
    Schema.Union(Schema.DateFromSelf, Schema.DateFromString),
  ),
  showMessageList: Schema.optional(Schema.Boolean),
});

export type MultipleMessageSendingRequestSchema = Schema.Schema.Type<
  typeof multipleMessageSendingRequestSchema
>;

export type SingleMessageSendingRequestSchema = Schema.Schema.Type<
  typeof singleMessageSendingRequestSchema
>;
