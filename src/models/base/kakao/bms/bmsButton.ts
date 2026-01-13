import {Schema} from 'effect';

/**
 * BMS 버튼 링크 타입
 * AC: 채널 추가
 * WL: 웹 링크
 * AL: 앱 링크
 * BK: 봇 키워드
 * MD: 메시지 전달
 * BC: 상담 요청
 * BT: 봇 전환
 * BF: 비즈니스폼
 */
export const bmsButtonLinkTypeSchema = Schema.Literal(
  'AC',
  'WL',
  'AL',
  'BK',
  'MD',
  'BC',
  'BT',
  'BF',
);

export type BmsButtonLinkType = Schema.Schema.Type<
  typeof bmsButtonLinkTypeSchema
>;

/**
 * BMS 웹 링크 버튼 스키마 (WL)
 * - name: 버튼명 (필수)
 * - linkMobile: 모바일 링크 (필수)
 * - linkPc: PC 링크 (선택)
 * - targetOut: 외부 브라우저 열기 (선택)
 */
export const bmsWebButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('WL'),
  linkMobile: Schema.String,
  linkPc: Schema.optional(Schema.String),
  targetOut: Schema.optional(Schema.Boolean),
});

export type BmsWebButton = Schema.Schema.Type<typeof bmsWebButtonSchema>;

/**
 * BMS 앱 링크 버튼 스키마 (AL)
 * - name: 버튼명 (필수)
 * - linkMobile, linkAndroid, linkIos 중 하나 이상 필수
 * - targetOut: 외부 브라우저 열기 (선택)
 */
export const bmsAppButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('AL'),
  linkMobile: Schema.optional(Schema.String),
  linkAndroid: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
  targetOut: Schema.optional(Schema.Boolean),
}).pipe(
  Schema.filter(button => {
    const hasLink = button.linkMobile || button.linkAndroid || button.linkIos;
    return hasLink
      ? true
      : 'AL 타입 버튼은 linkMobile, linkAndroid, linkIos 중 하나 이상 필수입니다.';
  }),
);

export type BmsAppButton = Schema.Schema.Type<typeof bmsAppButtonSchema>;

/**
 * BMS 채널 추가 버튼 스키마 (AC)
 * - name: 서버에서 삭제되므로 선택
 */
export const bmsChannelAddButtonSchema = Schema.Struct({
  name: Schema.optional(Schema.String),
  linkType: Schema.Literal('AC'),
});

export type BmsChannelAddButton = Schema.Schema.Type<
  typeof bmsChannelAddButtonSchema
>;

/**
 * BMS 봇 키워드 버튼 스키마 (BK)
 * - name: 버튼명 (필수)
 * - chatExtra: 봇에 전달할 추가 정보 (선택)
 */
export const bmsBotKeywordButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('BK'),
  chatExtra: Schema.optional(Schema.String),
});

export type BmsBotKeywordButton = Schema.Schema.Type<
  typeof bmsBotKeywordButtonSchema
>;

/**
 * BMS 메시지 전달 버튼 스키마 (MD)
 * - name: 버튼명 (필수)
 * - chatExtra: 봇에 전달할 추가 정보 (선택)
 */
export const bmsMessageDeliveryButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('MD'),
  chatExtra: Schema.optional(Schema.String),
});

export type BmsMessageDeliveryButton = Schema.Schema.Type<
  typeof bmsMessageDeliveryButtonSchema
>;

/**
 * BMS 상담 요청 버튼 스키마 (BC)
 * - name: 버튼명 (필수)
 * - chatExtra: 상담사에게 전달할 추가 정보 (선택)
 */
export const bmsConsultButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('BC'),
  chatExtra: Schema.optional(Schema.String),
});

export type BmsConsultButton = Schema.Schema.Type<
  typeof bmsConsultButtonSchema
>;

/**
 * BMS 봇 전환 버튼 스키마 (BT)
 * - name: 버튼명 (필수)
 * - chatExtra: 봇에 전달할 추가 정보 (선택)
 */
export const bmsBotTransferButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('BT'),
  chatExtra: Schema.optional(Schema.String),
});

export type BmsBotTransferButton = Schema.Schema.Type<
  typeof bmsBotTransferButtonSchema
>;

/**
 * BMS 비즈니스폼 버튼 스키마 (BF)
 * - name: 버튼명 (필수)
 */
export const bmsBusinessFormButtonSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('BF'),
});

export type BmsBusinessFormButton = Schema.Schema.Type<
  typeof bmsBusinessFormButtonSchema
>;

/**
 * BMS 버튼 통합 타입
 */
export type BmsButton =
  | BmsWebButton
  | BmsAppButton
  | BmsChannelAddButton
  | BmsBotKeywordButton
  | BmsMessageDeliveryButton
  | BmsConsultButton
  | BmsBotTransferButton
  | BmsBusinessFormButton;

/**
 * BMS 버튼 통합 스키마 (Union) - Discriminated by linkType
 */
export const bmsButtonSchema = Schema.Union(
  bmsWebButtonSchema,
  bmsAppButtonSchema,
  bmsChannelAddButtonSchema,
  bmsBotKeywordButtonSchema,
  bmsMessageDeliveryButtonSchema,
  bmsConsultButtonSchema,
  bmsBotTransferButtonSchema,
  bmsBusinessFormButtonSchema,
);

export type BmsButtonSchema = Schema.Schema.Type<typeof bmsButtonSchema>;

/**
 * BMS 링크 버튼 스키마 (WL, AL만 허용) - 캐러셀 등 일부 타입에서 사용
 */
export const bmsLinkButtonSchema = Schema.Union(
  bmsWebButtonSchema,
  bmsAppButtonSchema,
);

export type BmsLinkButtonSchema = Schema.Schema.Type<
  typeof bmsLinkButtonSchema
>;
