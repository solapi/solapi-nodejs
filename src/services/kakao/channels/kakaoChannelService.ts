import {runSafePromise} from '@lib/effectErrorHandler';
import {decodeWithBadRequest, safeFinalize} from '@lib/schemaUtils';
import stringifyQuery from '@lib/stringifyQuery';
import {
  decodeKakaoChannel,
  type KakaoChannel,
  type KakaoChannelCategory,
  type KakaoChannelSchema,
  kakaoChannelCategorySchema,
  kakaoChannelSchema,
} from '@models/base/kakao/kakaoChannel';
import {
  type CreateKakaoChannelRequest,
  type CreateKakaoChannelTokenRequest,
} from '@models/requests/kakao/createKakaoChannelRequest';
import {
  finalizeGetKakaoChannelsRequest,
  type GetKakaoChannelsRequest,
  getKakaoChannelsRequestSchema,
} from '@models/requests/kakao/getKakaoChannelsRequest';
import {
  type GetKakaoChannelsFinalizeResponse,
  type GetKakaoChannelsResponse,
  getKakaoChannelsResponseSchema,
} from '@models/responses/kakao/getKakaoChannelsResponse';
import {
  type CreateKakaoChannelResponse,
  type RequestKakaoChannelTokenResponse,
} from '@models/responses/messageResponses';
import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import DefaultService from '../../defaultService';

const kakaoChannelCategoryListSchema = Schema.Array(kakaoChannelCategorySchema);

export default class KakaoChannelService extends DefaultService {
  async getKakaoChannelCategories(): Promise<Array<KakaoChannelCategory>> {
    return runSafePromise(
      Effect.map(
        this.requestEffect<never, ReadonlyArray<KakaoChannelCategory>>({
          httpMethod: 'GET',
          url: 'kakao/v2/channels/categories',
          responseSchema: kakaoChannelCategoryListSchema,
        }),
        list => [...list],
      ),
    );
  }

  async getKakaoChannels(
    data?: GetKakaoChannelsRequest,
  ): Promise<GetKakaoChannelsFinalizeResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const validated = data
          ? yield* decodeWithBadRequest(getKakaoChannelsRequestSchema, data)
          : undefined;
        const payload = yield* safeFinalize(() =>
          finalizeGetKakaoChannelsRequest(validated),
        );
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        const response = yield* reqEffect<never, GetKakaoChannelsResponse>({
          httpMethod: 'GET',
          url: `kakao/v2/channels${parameter}`,
          responseSchema: getKakaoChannelsResponseSchema,
        });
        return {
          limit: response.limit,
          nextKey: response.nextKey,
          startKey: response.startKey,
          channelList: yield* Effect.all(
            response.channelList.map(decodeKakaoChannel),
          ),
        };
      }),
    );
  }

  async getKakaoChannel(channelId: string): Promise<KakaoChannel> {
    return runSafePromise(
      Effect.flatMap(
        this.requestEffect<never, KakaoChannelSchema>({
          httpMethod: 'GET',
          url: `kakao/v2/channels/${channelId}`,
          responseSchema: kakaoChannelSchema,
        }),
        decodeKakaoChannel,
      ),
    );
  }

  async requestKakaoChannelToken(
    data: CreateKakaoChannelTokenRequest,
  ): Promise<RequestKakaoChannelTokenResponse> {
    return runSafePromise(
      this.requestEffect<
        CreateKakaoChannelTokenRequest,
        RequestKakaoChannelTokenResponse
      >({
        httpMethod: 'POST',
        url: 'kakao/v2/channels/token',
        body: data,
      }),
    );
  }

  async createKakaoChannel(
    data: CreateKakaoChannelRequest,
  ): Promise<CreateKakaoChannelResponse> {
    return runSafePromise(
      this.requestEffect<CreateKakaoChannelRequest, CreateKakaoChannelResponse>(
        {
          httpMethod: 'POST',
          url: 'kakao/v2/channels',
          body: data,
        },
      ),
    );
  }

  async removeKakaoChannel(channelId: string): Promise<KakaoChannel> {
    return runSafePromise(
      Effect.flatMap(
        this.requestEffect<never, KakaoChannelSchema>({
          httpMethod: 'DELETE',
          url: `kakao/v2/channels/${channelId}`,
        }),
        decodeKakaoChannel,
      ),
    );
  }
}
