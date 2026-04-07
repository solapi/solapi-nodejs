import {runSafePromise} from '@lib/effectErrorHandler';
import stringifyQuery from '@lib/stringifyQuery';
import {
  decodeKakaoChannel,
  type KakaoChannel,
  type KakaoChannelCategory,
  type KakaoChannelSchema,
} from '@models/base/kakao/kakaoChannel';
import {
  type CreateKakaoChannelRequest,
  type CreateKakaoChannelTokenRequest,
} from '@models/requests/kakao/createKakaoChannelRequest';
import {
  finalizeGetKakaoChannelsRequest,
  type GetKakaoChannelsRequest,
} from '@models/requests/kakao/getKakaoChannelsRequest';
import {
  type GetKakaoChannelsFinalizeResponse,
  type GetKakaoChannelsResponse,
} from '@models/responses/kakao/getKakaoChannelsResponse';
import {
  type CreateKakaoChannelResponse,
  type RequestKakaoChannelTokenResponse,
} from '@models/responses/messageResponses';
import * as Effect from 'effect/Effect';
import DefaultService from '../../defaultService';

export default class KakaoChannelService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  async getKakaoChannelCategories(): Promise<Array<KakaoChannelCategory>> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        return yield* reqEffect<never, Array<KakaoChannelCategory>>({
          httpMethod: 'GET',
          url: 'kakao/v2/channels/categories',
        });
      }),
    );
  }

  async getKakaoChannels(
    data?: GetKakaoChannelsRequest,
  ): Promise<GetKakaoChannelsFinalizeResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const payload = finalizeGetKakaoChannelsRequest(data);
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        const response = yield* reqEffect<never, GetKakaoChannelsResponse>({
          httpMethod: 'GET',
          url: `kakao/v2/channels${parameter}`,
        });
        return {
          limit: response.limit,
          nextKey: response.nextKey,
          startKey: response.startKey,
          channelList: response.channelList.map(decodeKakaoChannel),
        };
      }),
    );
  }

  async getKakaoChannel(channelId: string): Promise<KakaoChannel> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<never, KakaoChannelSchema>({
          httpMethod: 'GET',
          url: `kakao/v2/channels/${channelId}`,
        });
        return decodeKakaoChannel(response);
      }),
    );
  }

  async requestKakaoChannelToken(
    data: CreateKakaoChannelTokenRequest,
  ): Promise<RequestKakaoChannelTokenResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        return yield* reqEffect<
          CreateKakaoChannelTokenRequest,
          RequestKakaoChannelTokenResponse
        >({
          httpMethod: 'POST',
          url: 'kakao/v2/channels/token',
          body: data,
        });
      }),
    );
  }

  async createKakaoChannel(
    data: CreateKakaoChannelRequest,
  ): Promise<CreateKakaoChannelResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        return yield* reqEffect<
          CreateKakaoChannelRequest,
          CreateKakaoChannelResponse
        >({
          httpMethod: 'POST',
          url: 'kakao/v2/channels',
          body: data,
        });
      }),
    );
  }

  async removeKakaoChannel(channelId: string): Promise<KakaoChannel> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<never, KakaoChannelSchema>({
          httpMethod: 'DELETE',
          url: `kakao/v2/channels/${channelId}`,
        });
        return decodeKakaoChannel(response);
      }),
    );
  }
}
