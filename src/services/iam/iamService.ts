import {runSafePromise} from '@lib/effectErrorHandler';
import {
  finalizeGetBlacksRequest,
  type GetBlacksRequest,
  getBlacksRequestSchema,
} from '@models/requests/iam/getBlacksRequest';
import {
  finalizeGetBlockGroupsRequest,
  type GetBlockGroupsRequest,
  getBlockGroupsRequestSchema,
} from '@models/requests/iam/getBlockGroupsRequest';
import {
  finalizeGetBlockNumbersRequest,
  type GetBlockNumbersRequest,
  getBlockNumbersRequestSchema,
} from '@models/requests/iam/getBlockNumbersRequest';
import {
  GetBlacksResponse,
  getBlacksResponseSchema,
} from '@models/responses/iam/getBlacksResponse';
import {
  GetBlockGroupsResponse,
  getBlockGroupsResponseSchema,
} from '@models/responses/iam/getBlockGroupsResponse';
import {
  GetBlockNumbersResponse,
  getBlockNumbersResponseSchema,
} from '@models/responses/iam/getBlockNumbersResponse';
import DefaultService from '../defaultService';

export default class IamService extends DefaultService {
  /**
   * 080 수신 거부 조회
   * @param data 080 수신 거부 상세 조회용 request 데이터
   * @returns GetBlacksResponse
   */
  async getBlacks(data?: GetBlacksRequest): Promise<GetBlacksResponse> {
    return runSafePromise(
      this.getWithQuery({
        schema: getBlacksRequestSchema,
        finalize: finalizeGetBlacksRequest,
        url: 'iam/v1/black',
        data,
        responseSchema: getBlacksResponseSchema,
      }),
    );
  }

  /**
   * 수신 거부 그룹 조회
   * @param data 수신 거부 그룹 조회용 request 데이터
   * @returns GetBlockGroupsResponse
   */
  async getBlockGroups(
    data?: GetBlockGroupsRequest,
  ): Promise<GetBlockGroupsResponse> {
    return runSafePromise(
      this.getWithQuery({
        schema: getBlockGroupsRequestSchema,
        finalize: finalizeGetBlockGroupsRequest,
        url: 'iam/v1/block/groups',
        data,
        responseSchema: getBlockGroupsResponseSchema,
      }),
    );
  }

  /**
   * 수신 거부 번호 조회
   * @param data 수신 거부 번호 상세 조회용 request 데이터
   * @returns GetBlockNumbersResponse
   */
  async getBlockNumbers(
    data?: GetBlockNumbersRequest,
  ): Promise<GetBlockNumbersResponse> {
    return runSafePromise(
      this.getWithQuery({
        schema: getBlockNumbersRequestSchema,
        finalize: finalizeGetBlockNumbersRequest,
        url: 'iam/v1/block/numbers',
        data,
        responseSchema: getBlockNumbersResponseSchema,
      }),
    );
  }
}
