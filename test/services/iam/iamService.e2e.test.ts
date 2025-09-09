import {describe, expect, it} from 'vitest';
import IamService from '@/services/iam/iamService';

describe('IamService E2E', () => {
  let iamService: IamService;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    iamService = new IamService(apiKey, apiSecret);
  });

  it('should return black list', async () => {
    // when
    const result = await iamService.getBlacks();

    // then
    expect(result).toBeTypeOf('object');
    expect(Array.isArray(result.blackList)).toBe(true);
  });

  it('should return block groups', async () => {
    // when
    const result = await iamService.getBlockGroups();

    // then
    expect(result).toBeTypeOf('object');
    expect(Array.isArray(result.blockGroups)).toBe(true);
  });

  it('should return block numbers', async () => {
    // when
    const result = await iamService.getBlockNumbers();

    // then
    expect(result).toBeTypeOf('object');
    expect(Array.isArray(result.blockNumbers)).toBe(true);
  });
});
