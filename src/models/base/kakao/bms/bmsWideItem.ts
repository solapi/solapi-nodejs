import {Schema} from 'effect';

/**
 * BMS 와이드 아이템 타입 (WIDE_ITEM_LIST용)
 */
export type BmsWideItem = {
  title: string;
  description?: string;
  imageId?: string;
  linkMobile?: string;
  linkPc?: string;
  linkAndroid?: string;
  linkIos?: string;
};

/**
 * BMS 와이드 아이템 스키마
 * - title: 제목 (필수)
 * - description: 설명 (선택)
 * - imageId: 이미지 ID (선택)
 * - linkMobile, linkPc, linkAndroid, linkIos: 링크 (선택)
 */
export const bmsWideItemSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  imageId: Schema.optional(Schema.String),
  linkMobile: Schema.optional(Schema.String),
  linkPc: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

export type BmsWideItemSchema = Schema.Schema.Type<typeof bmsWideItemSchema>;
