import {Schema} from 'effect';

/**
 * BMS 메인 와이드 아이템 타입 (WIDE_ITEM_LIST용)
 */
export type BmsMainWideItem = {
  title?: string;
  imageId: string;
  linkMobile: string;
  linkPc?: string;
  linkAndroid?: string;
  linkIos?: string;
};

/**
 * BMS 서브 와이드 아이템 타입 (WIDE_ITEM_LIST용)
 */
export type BmsSubWideItem = {
  title: string;
  imageId: string;
  linkMobile: string;
  linkPc?: string;
  linkAndroid?: string;
  linkIos?: string;
};

/**
 * BMS 메인 와이드 아이템 스키마
 * - title: 제목 (선택, max 25자)
 * - imageId: 이미지 ID (필수, BMS_WIDE_MAIN_ITEM_LIST 타입)
 * - linkMobile: 모바일 링크 (필수)
 * - linkPc, linkAndroid, linkIos: 링크 (선택)
 */
export const bmsMainWideItemSchema = Schema.Struct({
  title: Schema.optional(Schema.String),
  imageId: Schema.String,
  linkMobile: Schema.String,
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsMainWideItemSchema = Schema.Schema.Type<
  typeof bmsMainWideItemSchema
>;

/**
 * BMS 서브 와이드 아이템 스키마
 * - title: 제목 (필수, max 30자)
 * - imageId: 이미지 ID (필수, BMS_WIDE_SUB_ITEM_LIST 타입)
 * - linkMobile: 모바일 링크 (필수)
 * - linkPc, linkAndroid, linkIos: 링크 (선택)
 */
export const bmsSubWideItemSchema = Schema.Struct({
  title: Schema.String,
  imageId: Schema.String,
  linkMobile: Schema.String,
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsSubWideItemSchema = Schema.Schema.Type<
  typeof bmsSubWideItemSchema
>;

/**
 * @deprecated bmsMainWideItemSchema 또는 bmsSubWideItemSchema 사용 권장
 * BMS 와이드 아이템 통합 스키마 (하위 호환성)
 */
export const bmsWideItemSchema = bmsSubWideItemSchema;

export type BmsWideItem = BmsSubWideItem;
export type BmsWideItemSchema = BmsSubWideItemSchema;
