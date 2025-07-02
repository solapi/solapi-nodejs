import KakaoTemplateService from '@/services/kakao/templates/kakaoTemplateService';
import {beforeAll, describe, expect, it} from 'vitest';

describe('KakaoTemplateService E2E', () => {
  let kakaoTemplateService: KakaoTemplateService;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    kakaoTemplateService = new KakaoTemplateService(apiKey, apiSecret);
  });

  it('should return kakao alimtalk template categories', async () => {
    // when
    const result =
      await kakaoTemplateService.getKakaoAlimtalkTemplateCategories();

    // then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return kakao alimtalk templates', async () => {
    // when
    const result = await kakaoTemplateService.getKakaoAlimtalkTemplates();

    // then
    expect(result).toBeTypeOf('object');
    expect(Array.isArray(result.templateList)).toBe(true);
  });

  it('should throw error for non-existent template', async () => {
    // given
    const nonExistentTemplateId = 'non-existent-template';

    // when & then
    await expect(
      kakaoTemplateService.getKakaoAlimtalkTemplate(nonExistentTemplateId),
    ).rejects.toThrow();
  });
});
