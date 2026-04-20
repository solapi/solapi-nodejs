import {runSafePromise} from '@lib/effectErrorHandler';
import {
  type GetBalanceResponse,
  getBalanceResponseSchema,
} from '@models/responses/messageResponses';
import DefaultService from '../defaultService';

export default class CashService extends DefaultService {
  /**
   * 잔액조회
   * @returns GetBalanceResponse
   */
  async getBalance(): Promise<GetBalanceResponse> {
    return runSafePromise(
      this.requestEffect({
        httpMethod: 'GET',
        url: 'cash/v1/balance',
        responseSchema: getBalanceResponseSchema,
      }),
    );
  }
}
