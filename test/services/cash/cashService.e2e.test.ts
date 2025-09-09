import {describe, expect, it} from 'vitest';
import CashService from '@/services/cash/cashService';

describe('CashService E2E', () => {
  it('should return balance and point', async () => {
    // given
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    const cashService = new CashService(apiKey, apiSecret);

    // when
    const result = await cashService.getBalance();

    // then
    expect(result).toBeTypeOf('object');
    expect(result.balance).toBeTypeOf('number');
    expect(result.point).toBeTypeOf('number');
  });
});
