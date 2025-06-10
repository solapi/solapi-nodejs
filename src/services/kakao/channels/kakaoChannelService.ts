import stringifyQuery from '../../../lib/stringifyQuery';
import {
  KakaoChannel,
  KakaoChannelCategory,
  KakaoChannelInterface,
} from '../../../models/kakao/kakaoChannel';
import {
  GetKakaoChannelsFinalizeRequest,
  GetKakaoChannelsRequest,
} from '../../../models/requests/kakao/getKakaoChannelsRequest';
import {
  CreateKakaoChannelRequest,
  CreateKakaoChannelTokenRequest,
} from '../../../models/requests/messageRequest';
import {
  GetKakaoChannelsFinalizeResponse,
  GetKakaoChannelsResponse,
} from '../../../models/responses/kakao/getKakaoChannelsResponse';
import {
  CreateKakaoChannelResponse,
  RequestKakaoChannelTokenResponse,
} from '../../../models/responses/messageResponses';
import DefaultService from '../../defaultService';

export default class KakaoChannelService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 카카오 채널 카테고리 조회
   */
  async getKakaoChannelCategories(): Promise<Array<KakaoChannelCategory>> {
    return this.request<never, Array<KakaoChannelCategory>>({
      httpMethod: 'GET',
      url: 'kakao/v2/channels/categories',
    });
  }

  /**
   * 카카오 채널 목록 조회
   * @param data 카카오 채널 목록을 더 자세하게 조회할 때 필요한 파라미터
   */
  async getKakaoChannels(
    data?: GetKakaoChannelsRequest,
  ): Promise<GetKakaoChannelsFinalizeResponse> {
    let payload: GetKakaoChannelsFinalizeRequest = {};
    if (data) {
      payload = new GetKakaoChannelsFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {indices: false});
    const response = await this.request<never, GetKakaoChannelsResponse>({
      httpMethod: 'GET',
      url: `kakao/v2/channels${parameter}`,
    });
    const channelList = new Array<KakaoChannel>();
    for (const channel of response.channelList) {
      channelList.push(new KakaoChannel(channel));
    }
    return {
      limit: response.limit,
      nextKey: response.nextKey,
      startKey: response.startKey,
      channelList,
    };
  }

  /**
   * @description 카카오 채널 조회
   * @param channelId 카카오 채널 ID(구 pfId)
   */
  async getKakaoChannel(channelId: string): Promise<KakaoChannel> {
    const response = await this.request<never, KakaoChannelInterface>({
      httpMethod: 'GET',
      url: `kakao/v2/channels/${channelId}`,
    });
    return new KakaoChannel(response);
  }

  /**
   * @description 카카오 채널 연동을 위한 인증 토큰 요청
   */
  async requestKakaoChannelToken(
    data: CreateKakaoChannelTokenRequest,
  ): Promise<RequestKakaoChannelTokenResponse> {
    return this.request<
      CreateKakaoChannelTokenRequest,
      RequestKakaoChannelTokenResponse
    >({
      httpMethod: 'POST',
      url: 'kakao/v2/channels/token',
      body: data,
    });
  }

  /**
   * @description 카카오 채널 연동 메소드
   * getKakaoChannelCategories, requestKakaoChannelToken 메소드를 선행적으로 호출해야 합니다!
   */
  async createKakaoChannel(
    data: CreateKakaoChannelRequest,
  ): Promise<CreateKakaoChannelResponse> {
    return this.request<CreateKakaoChannelRequest, CreateKakaoChannelResponse>({
      httpMethod: 'POST',
      url: 'kakao/v2/channels',
      body: data,
    });
  }

  /**
   * @description 카카오 채널 삭제, 채널이 삭제 될 경우 해당 채널의 템플릿이 모두 삭제됩니다!
   * @param channelId 카카오 채널 ID
   */
  async removeKakaoChannel(channelId: string): Promise<KakaoChannel> {
    return this.request<never, KakaoChannel>({
      httpMethod: 'DELETE',
      url: `kakao/v2/channels/${channelId}`,
    });
  }
}
