import {Schema} from 'effect';
import {
  type KakaoChannel,
  kakaoChannelSchema,
} from '../../base/kakao/kakaoChannel';

export const getKakaoChannelsResponseSchema = Schema.Struct({
  limit: Schema.Number,
  startKey: Schema.NullishOr(Schema.String),
  nextKey: Schema.NullishOr(Schema.String),
  channelList: Schema.Array(kakaoChannelSchema),
});

export type GetKakaoChannelsResponse = Schema.Schema.Type<
  typeof getKakaoChannelsResponseSchema
>;

export type GetKakaoChannelsFinalizeResponse = {
  limit: number;
  startKey: string | null | undefined;
  nextKey: string | null | undefined;
  channelList: Array<KakaoChannel>;
};
