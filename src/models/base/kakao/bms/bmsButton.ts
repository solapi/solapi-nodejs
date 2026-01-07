import {Schema} from 'effect';

/**
 * BMS 버튼 링크 타입
 * WL: 웹 링크
 * AL: 앱 링크
 * AC: 채널 추가
 */
export type BmsButtonLinkType = 'WL' | 'AL' | 'AC';

/**
 * BMS 웹 링크 버튼 타입
 */
export type BmsWebButton = {
  name: string;
  linkType: 'WL';
  linkMobile: string;
  linkPc?: string;
};

/**
 * BMS 앱 링크 버튼 타입
 */
export type BmsAppButton = {
  name: string;
  linkType: 'AL';
  linkAndroid: string;
  linkIos: string;
};

/**
 * BMS 채널 추가 버튼 타입
 */
export type BmsChannelAddButton = {
  name: string;
  linkType: 'AC';
};

/**
 * BMS 버튼 통합 타입
 */
export type BmsButton = BmsWebButton | BmsAppButton | BmsChannelAddButton;

/**
 * BMS 웹 링크 버튼 스키마
 * - linkMobile 필수
 * - linkPc 선택
 */
export const bmsWebButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('WL'),
  linkMobile: Schema.String,
  linkPc: Schema.optional(Schema.String),
});

/**
 * BMS 앱 링크 버튼 스키마
 * - linkAndroid, linkIos 필수
 */
export const bmsAppButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('AL'),
  linkAndroid: Schema.String,
  linkIos: Schema.String,
});

/**
 * BMS 채널 추가 버튼 스키마
 */
export const bmsChannelAddButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('AC'),
});

/**
 * BMS 버튼 통합 스키마 (Union)
 */
export const bmsButtonSchema = Schema.Union(
  bmsWebButtonSchema,
  bmsAppButtonSchema,
  bmsChannelAddButtonSchema,
);

export type BmsButtonSchema = Schema.Schema.Type<typeof bmsButtonSchema>;

/**
 * BMS 버튼 스키마 (WL, AL만 허용) - 캐러셀 등 일부 타입에서 사용
 */
export const bmsLinkButtonSchema = Schema.Union(
  bmsWebButtonSchema,
  bmsAppButtonSchema,
);

export type BmsLinkButtonSchema = Schema.Schema.Type<
  typeof bmsLinkButtonSchema
>;
