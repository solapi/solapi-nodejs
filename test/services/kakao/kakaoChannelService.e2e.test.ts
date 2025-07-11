import KakaoChannelService from '@/services/kakao/channels/kakaoChannelService';
import {beforeAll, describe, expect, it} from 'vitest';

describe('KakaoChannelService E2E', () => {
  let kakaoChannelService: KakaoChannelService;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    kakaoChannelService = new KakaoChannelService(apiKey, apiSecret);
  });

  it('should return kakao channel categories', async () => {
    // when
    const result = await kakaoChannelService.getKakaoChannelCategories();

    // then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return kakao channels', async () => {
    // when
    const result = await kakaoChannelService.getKakaoChannels();

    // then
    expect(result).toBeTypeOf('object');
    expect(Array.isArray(result.channelList)).toBe(true);
  });

  it('should throw error for non-existent channel', async () => {
    // given
    const nonExistentChannelId = 'non-existent-channel';

    // when & then
    await expect(
      kakaoChannelService.getKakaoChannel(nonExistentChannelId),
    ).rejects.toThrow();
  });
});
