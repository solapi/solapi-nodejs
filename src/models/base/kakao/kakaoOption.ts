import {runSafeSync} from '@lib/effectErrorHandler';
import {Data, Effect, Array as EffectArray, pipe, Schema} from 'effect';
import {kakaoOptionRequest} from '../../requests/kakao/kakaoOptionRequest';
import {
  bmsButtonSchema,
  bmsCarouselCommerceSchema,
  bmsCarouselFeedSchema,
  bmsCommerceSchema,
  bmsCouponSchema,
  bmsMainWideItemSchema,
  bmsSubWideItemSchema,
  bmsVideoSchema,
} from './bms';
import {KakaoButton, kakaoButtonSchema} from './kakaoButton';

// Effect Data 타입을 활용한 에러 클래스
export class VariableValidationError extends Data.TaggedError(
  'VariableValidationError',
)<{
  readonly invalidVariables: ReadonlyArray<string>;
}> {
  toString(): string {
    const variableList = this.invalidVariables.map(v => `\`${v}\``).join(', ');
    return `변수명 ${variableList}에 점(.)을 포함할 수 없습니다. 언더스코어(_)나 다른 문자를 사용해주세요.`;
  }
}

/**
 * BMS chatBubbleType 스키마
 * 지원하는 8가지 말풍선 타입
 */
export const bmsChatBubbleTypeSchema = Schema.Literal(
  'TEXT',
  'IMAGE',
  'WIDE',
  'WIDE_ITEM_LIST',
  'COMMERCE',
  'CAROUSEL_FEED',
  'CAROUSEL_COMMERCE',
  'PREMIUM_VIDEO',
);

export type BmsChatBubbleType = Schema.Schema.Type<
  typeof bmsChatBubbleTypeSchema
>;

/**
 * chatBubbleType별 필수 필드 정의
 * - TEXT: content는 메시지의 text 필드에서 가져옴
 * - WIDE_ITEM_LIST: header, mainWideItem, subWideItemList 필수
 * - COMMERCE: imageId, commerce, buttons 필수
 */
const BMS_REQUIRED_FIELDS: Record<BmsChatBubbleType, ReadonlyArray<string>> = {
  TEXT: [],
  IMAGE: ['imageId'],
  WIDE: ['imageId'],
  WIDE_ITEM_LIST: ['header', 'mainWideItem', 'subWideItemList'],
  COMMERCE: ['imageId', 'commerce', 'buttons'],
  CAROUSEL_FEED: ['carousel'],
  CAROUSEL_COMMERCE: ['carousel'],
  PREMIUM_VIDEO: ['video'],
};

/**
 * BMS 캐러셀 통합 스키마 (CAROUSEL_FEED | CAROUSEL_COMMERCE)
 */
const bmsCarouselSchema = Schema.Union(
  bmsCarouselFeedSchema,
  bmsCarouselCommerceSchema,
);

/**
 * BMS 옵션 기본 스키마 (검증 전)
 */
const baseBmsSchema = Schema.Struct({
  // 필수 필드
  targeting: Schema.Literal('I', 'M', 'N'),
  chatBubbleType: bmsChatBubbleTypeSchema,

  // 선택 필드
  adult: Schema.optional(Schema.Boolean),
  header: Schema.optional(Schema.String),
  imageId: Schema.optional(Schema.String),
  imageLink: Schema.optional(Schema.String),
  additionalContent: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),

  // 복합 타입 필드
  carousel: Schema.optional(bmsCarouselSchema),
  mainWideItem: Schema.optional(bmsMainWideItemSchema),
  subWideItemList: Schema.optional(Schema.Array(bmsSubWideItemSchema)),
  buttons: Schema.optional(Schema.Array(bmsButtonSchema)),
  coupon: Schema.optional(bmsCouponSchema),
  commerce: Schema.optional(bmsCommerceSchema),
  video: Schema.optional(bmsVideoSchema),
});

type BaseBmsSchemaType = Schema.Schema.Type<typeof baseBmsSchema>;

const WIDE_ITEM_LIST_MIN_SUB_ITEMS = 3;

const validateBmsRequiredFields = (
  bms: BaseBmsSchemaType,
): boolean | string => {
  const chatBubbleType = bms.chatBubbleType;
  const requiredFields = BMS_REQUIRED_FIELDS[chatBubbleType] ?? [];
  const bmsRecord = bms as Record<string, unknown>;
  const missingFields = requiredFields.filter(
    field => bmsRecord[field] === undefined || bmsRecord[field] === null,
  );

  if (missingFields.length > 0) {
    return `BMS ${chatBubbleType} 타입에 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`;
  }

  if (chatBubbleType === 'WIDE_ITEM_LIST') {
    const subWideItemList = bms.subWideItemList;
    if (
      !subWideItemList ||
      subWideItemList.length < WIDE_ITEM_LIST_MIN_SUB_ITEMS
    ) {
      return `WIDE_ITEM_LIST 타입의 subWideItemList는 최소 ${WIDE_ITEM_LIST_MIN_SUB_ITEMS}개 이상이어야 합니다. 현재: ${subWideItemList?.length ?? 0}개`;
    }
  }

  return true;
};

/**
 * BMS 옵션 스키마 (chatBubbleType별 필수 필드 검증 포함)
 */
const kakaoOptionBmsSchema = baseBmsSchema.pipe(
  Schema.filter(validateBmsRequiredFields),
);

export type KakaoOptionBmsSchema = Schema.Schema.Type<
  typeof kakaoOptionBmsSchema
>;

// Constants for variable validation
const VARIABLE_KEY_PATTERN = /^#\{.+}$/;
const DOT_PATTERN = /\./;

// Pure helper functions optimized with Effect
const extractVariableName = (key: string): string =>
  VARIABLE_KEY_PATTERN.test(key) ? key.slice(2, -1) : key;

const formatVariableKey = (key: string): string =>
  VARIABLE_KEY_PATTERN.test(key) ? key : `#{${key}}`;

// Effect-based validation that returns Either instead of throwing
export const validateVariableNames = (
  variables: Record<string, string>,
): Effect.Effect<Record<string, string>, VariableValidationError> =>
  pipe(
    Object.keys(variables),
    EffectArray.map(extractVariableName),
    EffectArray.filter(variableName => DOT_PATTERN.test(variableName)),
    invalidVariables =>
      invalidVariables.length > 0
        ? Effect.fail(new VariableValidationError({invalidVariables}))
        : Effect.succeed(variables),
  );

// Optimized transformation function using Effect pipeline
export const transformVariables = (
  variables: Record<string, string>,
): Effect.Effect<Record<string, string>, VariableValidationError> =>
  pipe(
    validateVariableNames(variables),
    Effect.map(validVariables =>
      pipe(
        Object.entries(validVariables),
        EffectArray.map(
          ([key, value]) => [formatVariableKey(key), value] as const,
        ),
        entries => Object.fromEntries(entries),
      ),
    ),
  );

export const baseKakaoOptionSchema = Schema.Struct({
  pfId: Schema.String,
  templateId: Schema.optional(Schema.String),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}).pipe(
      Schema.transform(
        Schema.Record({key: Schema.String, value: Schema.String}),
        {
          decode: fromU => {
            // runSafeSync를 사용하여 깔끔한 에러 메시지 제공
            return runSafeSync(transformVariables(fromU));
          },
          encode: toI => toI,
        },
      ),
    ),
  ),
  disableSms: Schema.optional(Schema.Boolean),
  adFlag: Schema.optional(Schema.Boolean),
  imageId: Schema.optional(Schema.String),
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
  bms: Schema.optional(kakaoOptionBmsSchema),
});

export class KakaoOption {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: ReadonlyArray<KakaoButton>;
  imageId?: string;

  constructor(parameter: kakaoOptionRequest) {
    this.pfId = parameter.pfId;
    this.templateId = parameter.templateId;
    this.variables = parameter.variables;
    this.disableSms = parameter.disableSms;
    this.adFlag = parameter.adFlag;
    this.buttons = parameter.buttons;
    this.imageId = parameter.imageId;
  }
}
