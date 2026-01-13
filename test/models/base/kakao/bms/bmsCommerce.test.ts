import {bmsCommerceSchema} from '@models/base/kakao/bms/bmsCommerce';
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('BMS Commerce Schema', () => {
  describe('숫자 타입 필드 검증', () => {
    it('should accept number values for regularPrice', () => {
      const valid = {
        title: '상품명',
        regularPrice: 10000,
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
    });

    it('should accept numeric string values for regularPrice', () => {
      const valid = {
        title: '상품명',
        regularPrice: '10000',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.regularPrice).toBe(10000);
        expect(typeof result.right.regularPrice).toBe('number');
      }
    });

    it('should accept decimal numeric strings', () => {
      const valid = {
        title: '상품명',
        regularPrice: '10000.50',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.regularPrice).toBe(10000.5);
      }
    });

    it('should reject invalid string values', () => {
      const invalid = {
        title: '상품명',
        regularPrice: 'invalid',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });

    it('should reject empty string values', () => {
      const invalid = {
        title: '상품명',
        regularPrice: '',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });

    it('should reject whitespace-only string values', () => {
      const invalid = {
        title: '상품명',
        regularPrice: '   ',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });
  });

  describe('선택적 숫자 필드 검증', () => {
    it('should accept mixed number and string for optional fields', () => {
      const valid = {
        title: '상품명',
        regularPrice: 10000,
        discountPrice: '8000',
        discountRate: 20,
        discountFixed: '2000',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.discountPrice).toBe(8000);
        expect(result.right.discountRate).toBe(20);
        expect(result.right.discountFixed).toBe(2000);
      }
    });

    it('should accept all string values for numeric fields', () => {
      const valid = {
        title: '상품명',
        regularPrice: '15000',
        discountPrice: '12000',
        discountRate: '20',
        discountFixed: '3000',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.regularPrice).toBe(15000);
        expect(result.right.discountPrice).toBe(12000);
        expect(result.right.discountRate).toBe(20);
        expect(result.right.discountFixed).toBe(3000);
        // 모든 필드가 number 타입으로 변환되었는지 확인
        expect(typeof result.right.regularPrice).toBe('number');
        expect(typeof result.right.discountPrice).toBe('number');
        expect(typeof result.right.discountRate).toBe('number');
        expect(typeof result.right.discountFixed).toBe('number');
      }
    });

    it('should accept optional fields as undefined', () => {
      const valid = {
        title: '상품명',
        regularPrice: 10000,
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.discountPrice).toBeUndefined();
        expect(result.right.discountRate).toBeUndefined();
        expect(result.right.discountFixed).toBeUndefined();
      }
    });

    it('should reject invalid optional field values', () => {
      const invalid = {
        title: '상품명',
        regularPrice: 10000,
        discountPrice: 'invalid',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });
  });

  describe('필수 필드 검증', () => {
    it('should reject missing title', () => {
      const invalid = {
        regularPrice: 10000,
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });

    it('should reject missing regularPrice', () => {
      const invalid = {
        title: '상품명',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(invalid);
      expect(result._tag).toBe('Left');
    });
  });

  describe('실제 사용 사례 테스트', () => {
    it('should handle CAROUSEL_COMMERCE style input (string prices)', () => {
      // debug/bms_free/hosy_test.js의 CAROUSEL_COMMERCE 템플릿과 동일한 구조
      const valid = {
        title: '상품명2',
        regularPrice: '10000',
        discountPrice: '50',
        discountRate: '50',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.regularPrice).toBe(10000);
        expect(result.right.discountPrice).toBe(50);
        expect(result.right.discountRate).toBe(50);
      }
    });

    it('should handle COMMERCE style input (mixed types)', () => {
      const valid = {
        title: '상품명',
        regularPrice: 1000,
        discountPrice: '800',
        discountRate: 20,
        discountFixed: '200',
      };
      const result = Schema.decodeUnknownEither(bmsCommerceSchema)(valid);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.regularPrice).toBe(1000);
        expect(result.right.discountPrice).toBe(800);
        expect(result.right.discountRate).toBe(20);
        expect(result.right.discountFixed).toBe(200);
      }
    });
  });
});
