import {describe, expect, it} from 'vitest';
import {ApiKeyError, SolapiMessageService} from '../src/index';

describe('SolapiMessageService constructor', () => {
  it('should throw ApiKeyError when apiKey is empty', () => {
    expect(() => new SolapiMessageService('', 'secret')).toThrow(
      'API Key와 API Secret은 필수입니다.',
    );
  });

  it('should throw ApiKeyError when apiSecret is empty', () => {
    expect(() => new SolapiMessageService('key', '')).toThrow(
      'API Key와 API Secret은 필수입니다.',
    );
  });

  it('should throw ApiKeyError with correct _tag', () => {
    try {
      new SolapiMessageService('', '');
    } catch (e) {
      expect((e as ApiKeyError)._tag).toBe('ApiKeyError');
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should create instance with valid keys', () => {
    const service = new SolapiMessageService(
      'validApiKey1234',
      'validSecret1234',
    );
    expect(service).toBeInstanceOf(SolapiMessageService);
    expect(service.send).toBeTypeOf('function');
  });

  it('should bind all 32 service methods as functions', () => {
    const service = new SolapiMessageService(
      'validApiKey1234',
      'validSecret1234',
    );
    const expectedMethods = [
      'getBalance',
      'getBlacks',
      'getBlockGroups',
      'getBlockNumbers',
      'getKakaoChannelCategories',
      'getKakaoChannels',
      'getKakaoChannel',
      'requestKakaoChannelToken',
      'createKakaoChannel',
      'removeKakaoChannel',
      'getKakaoAlimtalkTemplateCategories',
      'createKakaoAlimtalkTemplate',
      'getKakaoAlimtalkTemplates',
      'getKakaoAlimtalkTemplate',
      'cancelInspectionKakaoAlimtalkTemplate',
      'updateKakaoAlimtalkTemplate',
      'updateKakaoAlimtalkTemplateName',
      'removeKakaoAlimtalkTemplate',
      'createGroup',
      'addMessagesToGroup',
      'sendGroup',
      'reserveGroup',
      'removeReservationToGroup',
      'getGroups',
      'getGroup',
      'getGroupMessages',
      'removeGroupMessages',
      'removeGroup',
      'send',
      'getMessages',
      'getStatistics',
      'uploadFile',
    ] as const;
    for (const method of expectedMethods) {
      expect(service[method]).toBeTypeOf('function');
    }
  });
});
