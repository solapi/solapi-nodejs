import path from 'path';
import {beforeAll, describe, expect, it} from 'vitest';
import StorageService from '@/services/storage/storageService';

describe('StorageService E2E', () => {
  let storageService: StorageService;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    storageService = new StorageService(apiKey, apiSecret);
  });

  it('should upload a file and return fileId', async () => {
    // given
    const imagePath = path.resolve(
      __dirname,
      '../../../examples/javascript/common/images/example.jpg',
    );

    // when
    const result = await storageService.uploadFile(imagePath, 'MMS');

    // then
    expect(result).toBeTypeOf('object');
    expect(result.fileId).toBeTypeOf('string');
  });
});
