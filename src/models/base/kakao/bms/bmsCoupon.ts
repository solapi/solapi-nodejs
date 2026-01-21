import {Schema} from 'effect';

// 숫자원 할인 쿠폰: 1~99999999원 (쉼표 없음)
const wonDiscountPattern = /^([1-9]\d{0,7})원 할인 쿠폰$/;

// 퍼센트 할인 쿠폰: 1~100%
const percentDiscountPattern = /^([1-9]\d?|100)% 할인 쿠폰$/;

// 무료 쿠폰: 앞 1~7자 (공백 포함 가능)
const freeCouponPattern = /^.{1,7} 무료 쿠폰$/;

// UP 쿠폰: 앞 1~7자 (공백 포함 가능)
const upCouponPattern = /^.{1,7} UP 쿠폰$/;

const isValidCouponTitle = (title: string): boolean => {
  // 1. 배송비 할인 쿠폰 (고정)
  if (title === '배송비 할인 쿠폰') return true;

  // 2. 숫자원 할인 쿠폰
  const wonMatch = title.match(wonDiscountPattern);
  if (wonMatch) {
    const num = parseInt(wonMatch[1], 10);
    return num >= 1 && num <= 99_999_999;
  }

  // 3. 퍼센트 할인 쿠폰
  if (percentDiscountPattern.test(title)) return true;

  // 4. 무료 쿠폰
  if (freeCouponPattern.test(title)) return true;

  // 5. UP 쿠폰
  return upCouponPattern.test(title);
};

/**
 * BMS 쿠폰 제목 스키마
 * 5가지 형식 허용:
 * - "${숫자}원 할인 쿠폰" (1~99,999,999)
 * - "${숫자}% 할인 쿠폰" (1~100)
 * - "배송비 할인 쿠폰"
 * - "${7자 이내} 무료 쿠폰"
 * - "${7자 이내} UP 쿠폰"
 */
export const bmsCouponTitleSchema = Schema.String.pipe(
  Schema.filter(isValidCouponTitle, {
    message: () =>
      '쿠폰 제목은 다음 형식 중 하나여야 합니다: ' +
      '"N원 할인 쿠폰" (1~99999999), ' +
      '"N% 할인 쿠폰" (1~100), ' +
      '"배송비 할인 쿠폰", ' +
      '"OOO 무료 쿠폰" (7자 이내), ' +
      '"OOO UP 쿠폰" (7자 이내)',
  }),
);

export type BmsCouponTitle = string;

/**
 * BMS 쿠폰 타입
 */
export type BmsCoupon = {
  title: BmsCouponTitle;
  description: string;
  linkMobile?: string;
  linkPc?: string;
  linkAndroid?: string;
  linkIos?: string;
};

/**
 * BMS 쿠폰 스키마
 * - title: 5가지 프리셋 중 하나 (필수)
 * - description: 설명 (필수, max 12-18 chars by type)
 * - linkMobile, linkPc, linkAndroid, linkIos: 링크 (선택)
 */
export const bmsCouponSchema = Schema.Struct({
  title: bmsCouponTitleSchema,
  description: Schema.String,
  linkMobile: Schema.optional(Schema.String),
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsCouponSchema = Schema.Schema.Type<typeof bmsCouponSchema>;
