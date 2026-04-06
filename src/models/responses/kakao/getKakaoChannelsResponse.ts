import {
  type KakaoChannel,
  type KakaoChannelSchema,
} from '../../base/kakao/kakaoChannel';

export type GetKakaoChannelsResponse = {
  limit: number;
  startKey: string;
  nextKey: string | null;
  channelList: Array<KakaoChannelSchema>;
};

export type GetKakaoChannelsFinalizeResponse = {
  limit: number;
  startKey: string;
  nextKey: string | null;
  channelList: Array<KakaoChannel>;
};
