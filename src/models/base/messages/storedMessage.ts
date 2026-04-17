import {Schema} from 'effect';
import {messageTypeSchema} from './message';

/**
 * 조회 응답(getMessages/getGroupMessages)에 포함된 메시지 아이템 스키마.
 *
 * 발송용 messageSchema와 달리 서버가 저장해둔 값을 그대로 반환하므로
 * - optional 필드 상당수가 null로 내려올 수 있다.
 * - kakaoOptions/rcsOptions 등 내부 구조가 발송 요청과 다르다(서버 정규화 포맷).
 *
 * 따라서 핵심 필드만 선언하고, 나머지는 런타임 통과를 위해 NullishOr/Unknown으로 관대하게 허용한다.
 * Schema.Struct는 기본적으로 extra 필드를 무시하므로 신규 필드 추가 시에도 drift 없이 통과한다.
 */
export const storedMessageSchema = Schema.Struct({
  messageId: Schema.optional(Schema.String),
  type: Schema.NullishOr(messageTypeSchema),
  to: Schema.optional(Schema.Union(Schema.String, Schema.Array(Schema.String))),
  from: Schema.NullishOr(Schema.String),
  text: Schema.NullishOr(Schema.String),
  imageId: Schema.NullishOr(Schema.String),
  subject: Schema.NullishOr(Schema.String),
  country: Schema.NullishOr(Schema.String),
  accountId: Schema.optional(Schema.String),
  groupId: Schema.optional(Schema.String),
  status: Schema.NullishOr(Schema.String),
  statusCode: Schema.NullishOr(Schema.String),
  reason: Schema.NullishOr(Schema.String),
  networkName: Schema.NullishOr(Schema.String),
  networkCode: Schema.NullishOr(Schema.String),
  customFields: Schema.optional(
    Schema.NullishOr(Schema.Record({key: Schema.String, value: Schema.String})),
  ),
  autoTypeDetect: Schema.optional(Schema.Union(Schema.Boolean, Schema.Number)),
  replacement: Schema.optional(Schema.Union(Schema.Boolean, Schema.Number)),
  resendCount: Schema.optional(Schema.Number),
  dateCreated: Schema.optional(Schema.String),
  dateUpdated: Schema.optional(Schema.String),
  dateProcessed: Schema.NullishOr(Schema.String),
  dateReceived: Schema.NullishOr(Schema.String),
  dateReported: Schema.NullishOr(Schema.String),
  kakaoOptions: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  rcsOptions: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  naverOptions: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  faxOptions: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  voiceOptions: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  replacements: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  log: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  queues: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  currentQueue: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  clusterKey: Schema.NullishOr(Schema.String),
  unavailableSenderNumber: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Number),
  ),
  faxPageCount: Schema.optional(Schema.Number),
  voiceDuration: Schema.optional(Schema.Number),
  voiceReplied: Schema.optional(Schema.Union(Schema.Boolean, Schema.Number)),
  _id: Schema.optional(Schema.String),
});
export type StoredMessage = Schema.Schema.Type<typeof storedMessageSchema>;
