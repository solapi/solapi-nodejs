import {Schema} from 'effect';
import {messageTypeSchema} from './message';

/**
 * 서버가 동일 필드를 boolean 또는 0/1 정수로 섞어 내려주는 경우가 있어
 * 소비자에게는 boolean으로만 노출되도록 wire 단계에서 정규화한다.
 */
const booleanOrZeroOne = Schema.transform(
  Schema.Union(Schema.Boolean, Schema.Number),
  Schema.Boolean,
  {
    decode: value => (typeof value === 'boolean' ? value : value !== 0),
    encode: value => value,
    strict: true,
  },
);

/**
 * 조회 응답(getMessages/getGroupMessages)에 포함된 메시지 아이템 스키마.
 *
 * 발송용 messageSchema와 달리 서버가 저장해둔 값을 그대로 반환하므로
 * - optional 필드 상당수가 null로 내려올 수 있다.
 * - kakaoOptions/rcsOptions 등 내부 구조가 발송 요청과 다르다(서버 정규화 포맷).
 *
 * 핵심 필드만 선언하고 타입 수준에서 검증/정규화한다. 여기에 없는 필드는
 * decodeServerResponse의 onExcessProperty:'preserve' 옵션으로 런타임에 그대로 보존된다.
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
  autoTypeDetect: Schema.optional(booleanOrZeroOne),
  replacement: Schema.optional(booleanOrZeroOne),
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
  unavailableSenderNumber: Schema.optional(booleanOrZeroOne),
  faxPageCount: Schema.optional(Schema.Number),
  voiceDuration: Schema.optional(Schema.Number),
  voiceReplied: Schema.optional(booleanOrZeroOne),
  _id: Schema.optional(Schema.String),
});
export type StoredMessage = Schema.Schema.Type<typeof storedMessageSchema>;
