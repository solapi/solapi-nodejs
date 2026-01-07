import {Schema} from 'effect';

/**
 * BMS 커머스 정보 타입
 */
export type BmsCommerce = {
  title: string;
  regularPrice: number;
  discountPrice?: number;
  discountRate?: number;
  discountFixed?: number;
};

/**
 * BMS 커머스 정보 스키마
 * - title: 상품명 (필수)
 * - regularPrice: 정가 (필수)
 * - discountPrice: 할인가 (선택)
 * - discountRate: 할인율 (선택)
 * - discountFixed: 고정 할인금액 (선택)
 */
export const bmsCommerceSchema = Schema.Struct({
  title: Schema.String,
  regularPrice: Schema.Number,
  discountPrice: Schema.optional(Schema.Number),
  discountRate: Schema.optional(Schema.Number),
  discountFixed: Schema.optional(Schema.Number),
});

export type BmsCommerceSchema = Schema.Schema.Type<typeof bmsCommerceSchema>;
