import {type InvalidDateError} from '@errors/defaultError';
import {safeDateTransfer} from '@lib/schemaUtils';
import {Schema} from 'effect';
import * as Effect from 'effect/Effect';

/**
 * @description 카카오 채널 카테고리 타입
 */
export const kakaoChannelCategorySchema = Schema.Struct({
  code: Schema.String,
  name: Schema.String,
});
export type KakaoChannelCategory = Schema.Schema.Type<
  typeof kakaoChannelCategorySchema
>;

/**
 * 카카오 채널 API 응답 스키마 (wire format)
 */
export const kakaoChannelSchema = Schema.Struct({
  channelId: Schema.String,
  searchId: Schema.String,
  accountId: Schema.String,
  phoneNumber: Schema.String,
  sharedAccountIds: Schema.Array(Schema.String),
  dateCreated: Schema.optional(
    Schema.Union(Schema.String, Schema.DateFromSelf),
  ),
  dateUpdated: Schema.optional(
    Schema.Union(Schema.String, Schema.DateFromSelf),
  ),
});

export type KakaoChannelSchema = Schema.Schema.Type<typeof kakaoChannelSchema>;

/**
 * 날짜 필드가 Date로 변환된 카카오 채널 타입
 */
export type KakaoChannel = {
  channelId: string;
  searchId: string;
  accountId: string;
  phoneNumber: string;
  sharedAccountIds: ReadonlyArray<string>;
  dateCreated?: Date;
  dateUpdated?: Date;
};

/**
 * API 응답 데이터를 KakaoChannel 타입으로 변환 (Effect 반환)
 */
export function decodeKakaoChannel(
  data: KakaoChannelSchema,
): Effect.Effect<KakaoChannel, InvalidDateError> {
  return Effect.gen(function* () {
    const dateCreated = yield* safeDateTransfer(data.dateCreated);
    const dateUpdated = yield* safeDateTransfer(data.dateUpdated);
    return {
      channelId: data.channelId,
      searchId: data.searchId,
      accountId: data.accountId,
      phoneNumber: data.phoneNumber,
      sharedAccountIds: data.sharedAccountIds,
      dateCreated,
      dateUpdated,
    };
  });
}
