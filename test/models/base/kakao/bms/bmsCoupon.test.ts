import {
  bmsCouponSchema,
  bmsCouponTitleSchema,
} from '@models/base/kakao/bms/bmsCoupon';
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('BMS Coupon Schema', () => {
  describe('bmsCouponTitleSchema', () => {
    const validTitles = [
      '할인 쿠폰',
      '배송비 쿠폰',
      '기간 제한 쿠폰',
      '이벤트 쿠폰',
      '적립금 쿠폰',
    ];

    it.each(validTitles)('should accept valid title: %s', title => {
      const result = Schema.decodeUnknownEither(bmsCouponTitleSchema)(title);
      expect(result._tag).toBe('Right');
    });

    it('should reject invalid title', () => {
      const result =
        Schema.decodeUnknownEither(bmsCouponTitleSchema)('잘못된 쿠폰');
      expect(result._tag).toBe('Left');
    });
  });

  describe('bmsCouponSchema', () => {
    it('should accept valid coupon with required fields', () => {
      const validCoupon = {
        title: '할인 쿠폰',
        description: '10% 할인',
      };

      const result = Schema.decodeUnknownEither(bmsCouponSchema)(validCoupon);
      expect(result._tag).toBe('Right');
    });

    it('should accept coupon with all optional fields', () => {
      const validCoupon = {
        title: '이벤트 쿠폰',
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
        title: '할인 쿠폰',
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
