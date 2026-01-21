import {Schema} from 'effect';
import {bmsLinkButtonSchema} from './bmsButton';
import {bmsCommerceSchema} from './bmsCommerce';
import {bmsCouponSchema} from './bmsCoupon';

/**
 * BMS 캐러셀 인트로(head) 스키마 (CAROUSEL_COMMERCE용)
 * - header: 헤더 (필수, max 20자)
 * - content: 내용 (필수, max 50자)
 * - imageId: 이미지 ID (필수)
 * - linkMobile: 모바일 링크 (선택, linkPc/Android/Ios 사용 시 필수)
 */
export const bmsCarouselHeadSchema = Schema.Struct({
  header: Schema.String,
  content: Schema.String,
  imageId: Schema.String,
  linkMobile: Schema.optional(Schema.String),
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsCarouselHeadSchema = Schema.Schema.Type<
  typeof bmsCarouselHeadSchema
>;

/**
 * BMS 캐러셀 tail 스키마
 * - linkMobile: 모바일 링크 (필수)
 */
export const bmsCarouselTailSchema = Schema.Struct({
  linkMobile: Schema.String,
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsCarouselTailSchema = Schema.Schema.Type<
  typeof bmsCarouselTailSchema
>;

/**
 * BMS 캐러셀 피드 아이템 타입 (CAROUSEL_FEED용)
 */
export type BmsCarouselFeedItem = {
  header: string;
  content: string;
  imageId: string;
  imageLink?: string;
  buttons: ReadonlyArray<Schema.Schema.Type<typeof bmsLinkButtonSchema>>;
  coupon?: Schema.Schema.Type<typeof bmsCouponSchema>;
};

/**
 * BMS 캐러셀 커머스 아이템 타입 (CAROUSEL_COMMERCE용)
 */
export type BmsCarouselCommerceItem = {
  commerce: Schema.Schema.Type<typeof bmsCommerceSchema>;
  imageId: string;
  imageLink?: string;
  buttons: ReadonlyArray<Schema.Schema.Type<typeof bmsLinkButtonSchema>>;
  additionalContent?: string;
  coupon?: Schema.Schema.Type<typeof bmsCouponSchema>;
};

/**
 * BMS 캐러셀 피드 아이템 스키마 (CAROUSEL_FEED용)
 * - header: 헤더 (필수, max 20자)
 * - content: 내용 (필수, max 180자)
 * - imageId: 이미지 ID (필수, BMS_CAROUSEL_FEED_LIST 타입)
 * - imageLink: 이미지 클릭 시 이동 링크 (선택)
 * - buttons: 버튼 목록 (필수, 1-2개, WL/AL만)
 * - coupon: 쿠폰 (선택)
 */
export const bmsCarouselFeedItemSchema = Schema.Struct({
  header: Schema.String,
  content: Schema.String,
  imageId: Schema.String,
  imageLink: Schema.optional(Schema.String),
  buttons: Schema.Array(bmsLinkButtonSchema),
  coupon: Schema.optional(bmsCouponSchema),
});

export type BmsCarouselFeedItemSchema = Schema.Schema.Type<
  typeof bmsCarouselFeedItemSchema
>;

/**
 * BMS 캐러셀 커머스 아이템 스키마 (CAROUSEL_COMMERCE용)
 * - commerce: 커머스 정보 (필수)
 * - imageId: 이미지 ID (필수, BMS_CAROUSEL_COMMERCE_LIST 타입)
 * - imageLink: 이미지 클릭 시 이동 링크 (선택)
 * - buttons: 버튼 목록 (필수, 1-2개, WL/AL만)
 * - additionalContent: 추가 내용 (선택, max 34자)
 * - coupon: 쿠폰 (선택)
 */
export const bmsCarouselCommerceItemSchema = Schema.Struct({
  commerce: bmsCommerceSchema,
  imageId: Schema.String,
  imageLink: Schema.optional(Schema.String),
  buttons: Schema.Array(bmsLinkButtonSchema),
  additionalContent: Schema.optional(Schema.String),
  coupon: Schema.optional(bmsCouponSchema),
});

export type BmsCarouselCommerceItemSchema = Schema.Schema.Type<
  typeof bmsCarouselCommerceItemSchema
>;

/**
 * BMS 캐러셀 피드 스키마 (CAROUSEL_FEED용)
 * - list: 캐러셀 아이템 목록 (필수, 2-6개, head 없을 때 / 1-5개, head 있을 때)
 * - tail: 더보기 링크 (선택)
 * Note: CAROUSEL_FEED에서는 head 사용 안함
 */
export const bmsCarouselFeedSchema = Schema.Struct({
  list: Schema.Array(bmsCarouselFeedItemSchema),
  tail: Schema.optional(bmsCarouselTailSchema),
});

export type BmsCarouselFeedSchema = Schema.Schema.Type<
  typeof bmsCarouselFeedSchema
>;

/**
 * BMS 캐러셀 커머스 스키마 (CAROUSEL_COMMERCE용)
 * - head: 캐러셀 인트로 (선택)
 * - list: 캐러셀 아이템 목록 (필수, 2-6개, head 없을 때 / 1-5개, head 있을 때)
 * - tail: 더보기 링크 (선택)
 */
export const bmsCarouselCommerceSchema = Schema.Struct({
  head: Schema.optional(bmsCarouselHeadSchema),
  list: Schema.Array(bmsCarouselCommerceItemSchema),
  tail: Schema.optional(bmsCarouselTailSchema),
});

export type BmsCarouselCommerceSchema = Schema.Schema.Type<
  typeof bmsCarouselCommerceSchema
>;

/**
 * @deprecated bmsCarouselHeadSchema 사용 권장
 */
export const bmsCarouselCommerceHeadSchema = bmsCarouselHeadSchema;

/**
 * @deprecated bmsCarouselTailSchema 사용 권장
 */
export const bmsCarouselCommerceTailSchema = bmsCarouselTailSchema;
