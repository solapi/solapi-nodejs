import {ParseResult, Schema} from 'effect';
import {messageTypeSchema} from './message';

/**
 * 서버가 동일 필드를 boolean 또는 0/1 정수로 섞어 내려주는 경우가 있어
 * 소비자에게는 boolean으로만 노출되도록 wire 단계에서 정규화한다.
 * 0/1 외의 숫자(NaN, 2, -1 등)는 drift 신호이므로 silent 처리하지 않고
 * ResponseSchemaMismatchError로 전파되도록 transformOrFail을 사용한다.
 */
const booleanOrZeroOne = Schema.transformOrFail(
  Schema.Union(Schema.Boolean, Schema.Number),
  Schema.Boolean,
  {
    decode: (value, _opts, ast) => {
      if (typeof value === 'boolean') return ParseResult.succeed(value);
      if (value === 0) return ParseResult.succeed(false);
      if (value === 1) return ParseResult.succeed(true);
      return ParseResult.fail(
        new ParseResult.Type(
          ast,
          value,
          `Expected boolean, 0, or 1 but received ${String(value)}`,
        ),
      );
    },
    encode: value => ParseResult.succeed(value),
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
  // 옵션 객체는 서버 정규화 포맷(저장 형태)으로 발송 요청용 스키마와 필드가 다르다.
  // 상세 타이핑을 확정하려면 각 옵션별 별도 조회 스키마 정의가 필요하지만 본 PR 범위를
  // 벗어나므로, 최소한 "object"임을 보장해 원시 값이 섞이는 drift를 감지할 수 있게 한다.
  kakaoOptions: Schema.optional(
    Schema.NullishOr(
      Schema.Record({key: Schema.String, value: Schema.Unknown}),
    ),
  ),
  rcsOptions: Schema.optional(
    Schema.NullishOr(
      Schema.Record({key: Schema.String, value: Schema.Unknown}),
    ),
  ),
  naverOptions: Schema.optional(
    Schema.NullishOr(
      Schema.Record({key: Schema.String, value: Schema.Unknown}),
    ),
  ),
  faxOptions: Schema.optional(
    Schema.NullishOr(
      Schema.Record({key: Schema.String, value: Schema.Unknown}),
    ),
  ),
  voiceOptions: Schema.optional(
    Schema.NullishOr(
      Schema.Record({key: Schema.String, value: Schema.Unknown}),
    ),
  ),
  replacements: Schema.optional(Schema.NullishOr(Schema.Array(Schema.Unknown))),
  log: Schema.optional(Schema.NullishOr(Schema.Array(Schema.Unknown))),
  queues: Schema.optional(Schema.NullishOr(Schema.Array(Schema.Unknown))),
  currentQueue: Schema.optional(Schema.NullishOr(Schema.Unknown)),
  clusterKey: Schema.NullishOr(Schema.String),
  unavailableSenderNumber: Schema.optional(Schema.NullishOr(booleanOrZeroOne)),
  faxPageCount: Schema.optional(Schema.NullishOr(Schema.Number)),
  voiceDuration: Schema.optional(Schema.NullishOr(Schema.Number)),
  voiceReplied: Schema.optional(Schema.NullishOr(booleanOrZeroOne)),
  _id: Schema.optional(Schema.String),
});
export type StoredMessage = Schema.Schema.Type<typeof storedMessageSchema>;
