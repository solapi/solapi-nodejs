import {
  bmsCouponSchema,
  bmsCouponTitleSchema,
} from '@models/base/kakao/bms/bmsCoupon';
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('BMS Coupon Schema', () => {
  describe('bmsCouponTitleSchema', () => {
    const validTitles = [
      '1000원 할인 쿠폰',
      '99999999원 할인 쿠폰',
      '50% 할인 쿠폰',
      '100% 할인 쿠폰',
      '배송비 할인 쿠폰',
      '신규가입 무료 쿠폰',
      '포인트 UP 쿠폰',
      '신규 가입 무료 쿠폰', // 공백 포함 7자
    ];

    it.each(validTitles)('should accept valid title: %s', title => {
      const result = Schema.decodeUnknownEither(bmsCouponTitleSchema)(title);
      expect(result._tag).toBe('Right');
    });

    const invalidTitles = [
      '잘못된 쿠폰',
      '0원 할인 쿠폰', // 0은 허용 안함
      '100000000원 할인 쿠폰', // 99999999 초과
      '0% 할인 쿠폰', // 0은 허용 안함
      '101% 할인 쿠폰', // 100 초과
      '12345678 무료 쿠폰', // 8자 이상
      '12345678 UP 쿠폰', // 8자 이상
    ];

    it.each(invalidTitles)('should reject invalid title: %s', title => {
      const result = Schema.decodeUnknownEither(bmsCouponTitleSchema)(title);
      expect(result._tag).toBe('Left');
    });
  });

  describe('bmsCouponSchema', () => {
    it('should accept valid coupon with required fields', () => {
      const validCoupon = {
        title: '10000원 할인 쿠폰',
        description: '10% 할인',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(validCoupon);
      expect(result._tag).toBe('Right');
    });

    it('should accept coupon with all optional fields', () => {
      const validCoupon = {
        title: '50% 할인 쿠폰',
        description: '특별 할인',
        linkMobile: 'https://m.example.com/coupon',
        linkPc: 'https://www.example.com/coupon',
        linkAndroid: 'intent://coupon',
        linkIos: 'example://coupon',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(validCoupon);
      expect(result._tag).toBe('Right');
    });

    it('should reject coupon without title', () => {
      const invalidCoupon = {
        description: '10% 할인',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(invalidCoupon);
      expect(result._tag).toBe('Left');
    });

    it('should reject coupon without description', () => {
      const invalidCoupon = {
        title: '10000원 할인 쿠폰',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(invalidCoupon);
      expect(result._tag).toBe('Left');
    });

    it('should reject coupon with invalid title', () => {
      const invalidCoupon = {
        title: '잘못된 쿠폰',
        description: '10% 할인',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(invalidCoupon);
      expect(result._tag).toBe('Left');
    });
  });
});
