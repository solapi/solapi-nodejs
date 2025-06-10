import stringifyQuery from '../../lib/stringifyQuery';
import {
  GetBlacksFinalizeRequest,
  GetBlacksRequest,
} from '../../models/requests/iam/getBlacksRequest';
import {
  GetBlockGroupsFinalizeRequest,
  GetBlockGroupsRequest,
} from '../../models/requests/iam/getBlockGroupsRequest';
import {GetBlacksResponse} from '../../models/responses/iam/getBlacksResponse';
import {GetBlockGroupsResponse} from '../../models/responses/iam/getBlockGroupsResponse';
import DefaultService from '../defaultService';

export default class IamService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 080 수신 거부 조회
   * @param data 080 수신 거부 상세 조회용 request 데이터
   * @returns GetBlacksResponse
   */
  async getBlacks(data?: GetBlacksRequest): Promise<GetBlacksResponse> {
    let payload: GetBlacksFinalizeRequest = {type: 'DENIAL'};
    if (data) {
      payload = new GetBlacksFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetBlacksResponse>({
      httpMethod: 'GET',
      url: `iam/v1/black${parameter}`,
    });
  }

  /**
   * 수신 거부 그룹 조회
   * @param data 수신 거부 그룹 조회용 request 데이터
   * @returns GetBlockGroupsResponse
   */
  async getBlockGroups(
    data?: GetBlockGroupsRequest,
  ): Promise<GetBlockGroupsResponse> {
    let payload: GetBlockGroupsFinalizeRequest = {};
    if (data) {
      payload = new GetBlockGroupsFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetBlockGroupsResponse>({
      httpMethod: 'GET',
      url: `iam/v1/block/groups${parameter}`,
    });
  }
}
