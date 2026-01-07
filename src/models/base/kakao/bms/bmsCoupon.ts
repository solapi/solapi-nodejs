import {Schema} from 'effect';

/**
 * BMS 쿠폰 제목 프리셋
 * API에서 허용하는 5가지 프리셋 값만 사용 가능
 */
export type BmsCouponTitle =
  | '할인 쿠폰'
  | '배송비 쿠폰'
  | '기간 제한 쿠폰'
  | '이벤트 쿠폰'
  | '적립금 쿠폰';

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
 * BMS 쿠폰 제목 스키마
 * 5가지 프리셋 값만 허용
 */
export const bmsCouponTitleSchema = Schema.Literal(
  '할인 쿠폰',
  '배송비 쿠폰',
  '기간 제한 쿠폰',
  '이벤트 쿠폰',
  '적립금 쿠폰',
);

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
