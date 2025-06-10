import {GetBalanceResponse} from '../../responses/messageResponses';
import DefaultService from '../defaultService';

export default class CashService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 잔액조회
   * @returns GetBalanceResponse
   */
  async getBalance(): Promise<GetBalanceResponse> {
    return this.request<never, GetBalanceResponse>({
      httpMethod: 'GET',
      url: 'cash/v1/balance',
    });
  }
}
