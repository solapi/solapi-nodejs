import stringDateTransfer from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';

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
 * @deprecated v6.0.0에서 KakaoChannelSchema를 사용하세요
 */
export type KakaoChannelInterface = KakaoChannelSchema;

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
 * API 응답 데이터를 KakaoChannel 타입으로 변환
 */
export function decodeKakaoChannel(data: KakaoChannelSchema): KakaoChannel {
  return {
    channelId: data.channelId,
    searchId: data.searchId,
    accountId: data.accountId,
    phoneNumber: data.phoneNumber,
    sharedAccountIds: data.sharedAccountIds,
    dateCreated:
      data.dateCreated != null
        ? stringDateTransfer(data.dateCreated)
        : undefined,
    dateUpdated:
      data.dateUpdated != null
        ? stringDateTransfer(data.dateUpdated)
        : undefined,
  };
}
