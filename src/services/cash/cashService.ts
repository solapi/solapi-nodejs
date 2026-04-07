import {runSafePromise} from '@lib/effectErrorHandler';
import {type GetBalanceResponse} from '@models/responses/messageResponses';
import * as Effect from 'effect/Effect';
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
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        return yield* reqEffect<never, GetBalanceResponse>({
          httpMethod: 'GET',
          url: 'cash/v1/balance',
        });
      }),
    );
  }
}
