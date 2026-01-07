import {Schema} from 'effect';
import {bmsLinkButtonSchema} from './bmsButton';
import {bmsCommerceSchema} from './bmsCommerce';
import {bmsCouponSchema} from './bmsCoupon';

/**
 * BMS 캐러셀 피드 아이템 타입 (CAROUSEL_FEED용)
 */
export type BmsCarouselFeedItem = {
  header: string;
  content: string;
  imageId: string;
  buttons: ReadonlyArray<Schema.Schema.Type<typeof bmsLinkButtonSchema>>;
  coupon?: Schema.Schema.Type<typeof bmsCouponSchema>;
};

/**
 * BMS 캐러셀 커머스 아이템 타입 (CAROUSEL_COMMERCE용)
 */
export type BmsCarouselCommerceItem = {
  commerce: Schema.Schema.Type<typeof bmsCommerceSchema>;
  imageId: string;
  buttons: ReadonlyArray<Schema.Schema.Type<typeof bmsLinkButtonSchema>>;
  additionalContent?: string;
  coupon?: Schema.Schema.Type<typeof bmsCouponSchema>;
};

/**
 * BMS 캐러셀 피드 아이템 스키마
 * - header: 헤더 (필수, max 20 chars)
 * - content: 내용 (필수, max 180 chars)
 * - imageId: 이미지 ID (필수)
 * - buttons: 버튼 목록 (필수, 1-2개, WL/AL만)
 * - coupon: 쿠폰 (선택)
 */
export const bmsCarouselFeedItemSchema = Schema.Struct({
  header: Schema.String,
  content: Schema.String,
  imageId: Schema.String,
  buttons: Schema.Array(bmsLinkButtonSchema),
  coupon: Schema.optional(bmsCouponSchema),
});

export type BmsCarouselFeedItemSchema = Schema.Schema.Type<
  typeof bmsCarouselFeedItemSchema
>;

/**
 * BMS 캐러셀 커머스 아이템 스키마
 * - commerce: 커머스 정보 (필수)
 * - imageId: 이미지 ID (필수)
 * - buttons: 버튼 목록 (필수, 1-2개, WL/AL만)
 * - additionalContent: 추가 내용 (선택, max 34 chars)
 * - coupon: 쿠폰 (선택)
 */
export const bmsCarouselCommerceItemSchema = Schema.Struct({
  commerce: bmsCommerceSchema,
  imageId: Schema.String,
  buttons: Schema.Array(bmsLinkButtonSchema),
  additionalContent: Schema.optional(Schema.String),
  coupon: Schema.optional(bmsCouponSchema),
});

export type BmsCarouselCommerceItemSchema = Schema.Schema.Type<
  typeof bmsCarouselCommerceItemSchema
>;

/**
 * BMS 캐러셀 피드 스키마 (CAROUSEL_FEED용)
 */
export const bmsCarouselFeedSchema = Schema.Struct({
  list: Schema.Array(bmsCarouselFeedItemSchema),
});

export type BmsCarouselFeedSchema = Schema.Schema.Type<
  typeof bmsCarouselFeedSchema
>;

/**
 * BMS 캐러셀 커머스 스키마 (CAROUSEL_COMMERCE용)
 */
export const bmsCarouselCommerceSchema = Schema.Struct({
  list: Schema.Array(bmsCarouselCommerceItemSchema),
});

export type BmsCarouselCommerceSchema = Schema.Schema.Type<
  typeof bmsCarouselCommerceSchema
>;
