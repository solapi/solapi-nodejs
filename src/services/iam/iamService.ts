import {runSafePromise} from '@lib/effectErrorHandler';
import {decodeWithBadRequest, safeFinalize} from '@lib/schemaUtils';
import stringifyQuery from '@lib/stringifyQuery';
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
import {GetBlacksResponse} from '@models/responses/iam/getBlacksResponse';
import {GetBlockGroupsResponse} from '@models/responses/iam/getBlockGroupsResponse';
import {GetBlockNumbersResponse} from '@models/responses/iam/getBlockNumbersResponse';
import * as Effect from 'effect/Effect';
import DefaultService from '../defaultService';

export default class IamService extends DefaultService {
  /**
   * 080 수신 거부 조회
   * @param data 080 수신 거부 상세 조회용 request 데이터
   * @returns GetBlacksResponse
   */
  async getBlacks(data?: GetBlacksRequest): Promise<GetBlacksResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const validated = data
          ? yield* decodeWithBadRequest(getBlacksRequestSchema, data)
          : undefined;
        const payload = yield* safeFinalize(() =>
          finalizeGetBlacksRequest(validated),
        );
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        return yield* reqEffect<never, GetBlacksResponse>({
          httpMethod: 'GET',
          url: `iam/v1/black${parameter}`,
        });
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
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const validated = data
          ? yield* decodeWithBadRequest(getBlockGroupsRequestSchema, data)
          : undefined;
        const payload = yield* safeFinalize(() =>
          finalizeGetBlockGroupsRequest(validated),
        );
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        return yield* reqEffect<never, GetBlockGroupsResponse>({
          httpMethod: 'GET',
          url: `iam/v1/block/groups${parameter}`,
        });
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
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const validated = data
          ? yield* decodeWithBadRequest(getBlockNumbersRequestSchema, data)
          : undefined;
        const payload = yield* safeFinalize(() =>
          finalizeGetBlockNumbersRequest(validated),
        );
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        return yield* reqEffect<never, GetBlockNumbersResponse>({
          httpMethod: 'GET',
          url: `iam/v1/block/numbers${parameter}`,
        });
      }),
    );
  }
}
