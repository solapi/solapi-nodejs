import {Schema} from 'effect';

/**
 * 부분 검색용 like 스키마 (getBlockGroups, getBlockNumbers 등에서 공유)
 */
export const likeLiteralSchema = Schema.Struct({like: Schema.String});

/**
 * @description GET API 중 일부 파라미터 조회 시 필요한 객체
 * @see https://docs.solapi.com/api-reference/overview#operator
 */
export const datePayloadSchema = Schema.Struct({
  eq: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  gte: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  lte: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  gt: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  lt: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type DatePayloadType = Schema.Schema.Type<typeof datePayloadSchema>;
