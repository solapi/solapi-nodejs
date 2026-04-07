import {Schema} from 'effect';
import {
  type KakaoChannel,
  kakaoChannelSchema,
} from '../../base/kakao/kakaoChannel';

export const getKakaoChannelsResponseSchema = Schema.Struct({
  limit: Schema.Number,
  startKey: Schema.String,
  nextKey: Schema.NullOr(Schema.String),
  channelList: Schema.Array(kakaoChannelSchema),
});

export type GetKakaoChannelsResponse = Schema.Schema.Type<
  typeof getKakaoChannelsResponseSchema
>;

export type GetKakaoChannelsFinalizeResponse = {
  limit: number;
  startKey: string;
  nextKey: string | null;
  channelList: Array<KakaoChannel>;
};
