import {
  bmsAppButtonSchema,
  bmsButtonSchema,
  bmsChannelAddButtonSchema,
  bmsLinkButtonSchema,
  bmsWebButtonSchema,
} from '@models/base/kakao/bms/bmsButton';
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('BMS Button Schema', () => {
  describe('bmsWebButtonSchema (WL)', () => {
    it('should accept valid web button with required fields', () => {
      const validButton = {
        name: '버튼명',
        linkType: 'WL',
        linkMobile: 'https://example.com',
      };

      const result =
        Schema.decodeUnknownEither(bmsWebButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should accept web button with optional linkPc', () => {
      const validButton = {
        name: '버튼명',
        linkType: 'WL',
        linkMobile: 'https://m.example.com',
        linkPc: 'https://www.example.com',
      };

      const result =
        Schema.decodeUnknownEither(bmsWebButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should reject web button without linkMobile', () => {
      const invalidButton = {
        name: '버튼명',
        linkType: 'WL',
      };

      const result =
        Schema.decodeUnknownEither(bmsWebButtonSchema)(invalidButton);
      expect(result._tag).toBe('Left');
    });
  });

  describe('bmsAppButtonSchema (AL)', () => {
    it('should accept valid app button with required fields', () => {
      const validButton = {
        name: '앱버튼',
        linkType: 'AL',
        linkAndroid: 'intent://example',
        linkIos: 'example://app',
      };

      const result =
        Schema.decodeUnknownEither(bmsAppButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should accept app button with only linkAndroid', () => {
      const validButton = {
        name: '앱버튼',
        linkType: 'AL',
        linkAndroid: 'intent://example',
      };

      const result =
        Schema.decodeUnknownEither(bmsAppButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should accept app button with only linkIos', () => {
      const validButton = {
        name: '앱버튼',
        linkType: 'AL',
        linkIos: 'example://app',
      };

      const result =
        Schema.decodeUnknownEither(bmsAppButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should accept app button with only linkMobile', () => {
      const validButton = {
        name: '앱버튼',
        linkType: 'AL',
        linkMobile: 'https://m.example.com',
      };

      const result =
        Schema.decodeUnknownEither(bmsAppButtonSchema)(validButton);
      expect(result._tag).toBe('Right');
    });

    it('should reject app button without any link', () => {
      const invalidButton = {
        name: '앱버튼',
        linkType: 'AL',
      };

      const result =
        Schema.decodeUnknownEither(bmsAppButtonSchema)(invalidButton);
      expect(result._tag).toBe('Left');
    });
  });

  describe('bmsChannelAddButtonSchema (AC)', () => {
    it('should accept valid channel add button', () => {
      const validButton = {
        name: '채널추가',
        linkType: 'AC',
      };

      const result = Schema.decodeUnknownEither(bmsChannelAddButtonSchema)(
        validButton,
      );
      expect(result._tag).toBe('Right');
    });
  });

  describe('bmsButtonSchema (Union)', () => {
    it('should accept WL button', () => {
      const button = {
        name: '웹링크',
        linkType: 'WL',
        linkMobile: 'https://example.com',
      };

      const result = Schema.decodeUnknownEither(bmsButtonSchema)(button);
      expect(result._tag).toBe('Right');
    });

    it('should accept AL button', () => {
      const button = {
        name: '앱링크',
        linkType: 'AL',
        linkAndroid: 'intent://example',
        linkIos: 'example://app',
      };

      const result = Schema.decodeUnknownEither(bmsButtonSchema)(button);
      expect(result._tag).toBe('Right');
    });

    it('should accept AC button', () => {
      const button = {
        name: '채널추가',
        linkType: 'AC',
      };

      const result = Schema.decodeUnknownEither(bmsButtonSchema)(button);
      expect(result._tag).toBe('Right');
    });

    it('should reject invalid linkType', () => {
      const invalidButton = {
        name: '버튼',
        linkType: 'INVALID',
      };

      const result = Schema.decodeUnknownEither(bmsButtonSchema)(invalidButton);
      expect(result._tag).toBe('Left');
    });
  });

  describe('bmsLinkButtonSchema (WL/AL only)', () => {
    it('should accept WL button', () => {
      const button = {
        name: '웹링크',
        linkType: 'WL',
        linkMobile: 'https://example.com',
      };

      const result = Schema.decodeUnknownEither(bmsLinkButtonSchema)(button);
      expect(result._tag).toBe('Right');
    });

    it('should accept AL button', () => {
      const button = {
        name: '앱링크',
        linkType: 'AL',
        linkAndroid: 'intent://example',
        linkIos: 'example://app',
      };

      const result = Schema.decodeUnknownEither(bmsLinkButtonSchema)(button);
      expect(result._tag).toBe('Right');
    });

    it('should reject AC button', () => {
      const button = {
        name: '채널추가',
        linkType: 'AC',
      };

      const result = Schema.decodeUnknownEither(bmsLinkButtonSchema)(button);
      expect(result._tag).toBe('Left');
    });
  });
});
