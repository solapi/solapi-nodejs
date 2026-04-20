import type {BmsChatBubbleType} from './bmsChatBubbleType';

type LinkType = 'AC' | 'WL' | 'AL' | 'BK' | 'MD' | 'BC' | 'BT' | 'BF';

/**
 * 쿠폰 설명 길이 제한
 * - WIDE 계열: 18자
 * - 그 외: 12자
 */
export const BMS_COUPON_DESCRIPTION_MAX: Record<BmsChatBubbleType, number> = {
  TEXT: 12,
  IMAGE: 12,
  WIDE: 18,
  WIDE_ITEM_LIST: 18,
  COMMERCE: 12,
  CAROUSEL_FEED: 12,
  CAROUSEL_COMMERCE: 12,
  PREMIUM_VIDEO: 12,
};

/**
 * 버튼 최대 개수 (쿠폰 미사용 / 사용 시)
 * 최소 개수는 별도로 관리 — 레퍼런스는 일부 타입에서 버튼 필수
 */
export const BMS_BUTTON_COUNT: Record<
  BmsChatBubbleType,
  {max: number; maxWithCoupon?: number; min?: number}
> = {
  TEXT: {max: 5, maxWithCoupon: 4},
  IMAGE: {max: 5, maxWithCoupon: 4},
  WIDE: {max: 2},
  WIDE_ITEM_LIST: {max: 2},
  COMMERCE: {max: 2, min: 1},
  CAROUSEL_FEED: {max: 2, min: 1},
  CAROUSEL_COMMERCE: {max: 2, min: 1},
  PREMIUM_VIDEO: {max: 1},
};

/**
 * 버튼명 최대 길이
 * - TEXT/IMAGE: 14자
 * - 그 외: 8자
 */
export const BMS_BUTTON_NAME_MAX: Record<BmsChatBubbleType, number> = {
  TEXT: 14,
  IMAGE: 14,
  WIDE: 8,
  WIDE_ITEM_LIST: 8,
  COMMERCE: 8,
  CAROUSEL_FEED: 8,
  CAROUSEL_COMMERCE: 8,
  PREMIUM_VIDEO: 8,
};

/**
 * chatBubbleType별 허용 linkType
 * - undefined: 전체 허용 (AC, WL, AL, BK, MD, BC, BT, BF)
 * - array: 해당 타입만 허용 (CAROUSEL/COMMERCE는 WL/AL 전용)
 */
export const BMS_ALLOWED_LINK_TYPES: Partial<
  Record<BmsChatBubbleType, ReadonlyArray<LinkType>>
> = {
  COMMERCE: ['WL', 'AL'],
  CAROUSEL_FEED: ['WL', 'AL'],
  CAROUSEL_COMMERCE: ['WL', 'AL'],
};

/**
 * 텍스트 길이 제한 (자)
 * - header/content/additionalContent
 * - mainWideItem.title / subWideItem.title
 * - carousel head/list의 header/content
 */
export const BMS_HEADER_MAX = 20;
export const BMS_ADDITIONAL_CONTENT_MAX = 34;
export const BMS_MAIN_WIDE_ITEM_TITLE_MAX = 25;
export const BMS_SUB_WIDE_ITEM_TITLE_MAX = 30;
export const BMS_CAROUSEL_HEAD_CONTENT_MAX = 50;
export const BMS_CAROUSEL_FEED_ITEM_CONTENT_MAX = 180;
export const BMS_CAROUSEL_COMMERCE_ADDITIONAL_CONTENT_MAX = 34;

/**
 * chatBubbleType별 content 길이
 * TEXT/IMAGE: 1300자, WIDE/PREMIUM_VIDEO: 76자
 */
export const BMS_CONTENT_MAX: Partial<Record<BmsChatBubbleType, number>> = {
  TEXT: 1300,
  IMAGE: 1300,
  WIDE: 76,
  PREMIUM_VIDEO: 76,
};

/**
 * 캐러셀 리스트 개수 범위 (head 유무에 따라 다름)
 * - head 有: 1~5
 * - head 無: 2~6
 */
export const BMS_CAROUSEL_LIST_RANGE = {
  withHead: {min: 1, max: 5},
  withoutHead: {min: 2, max: 6},
};

type LinkFields = {
  readonly linkPc?: string;
  readonly linkMobile?: string;
  readonly linkAndroid?: string;
  readonly linkIos?: string;
};

/**
 * 검증 함수 입력 타입 — baseBmsSchema의 decoded shape과 구조적으로 호환
 * 개별 필드를 optional로 선언하여 모든 chatBubbleType을 포괄
 */
export type BmsConstraintInput = {
  readonly chatBubbleType: BmsChatBubbleType;
  readonly content?: string;
  readonly header?: string;
  readonly additionalContent?: string;
  readonly imageId?: string;
  readonly imageLink?: string;
  readonly coupon?: {readonly description: string} & LinkFields;
  readonly buttons?: ReadonlyArray<
    {readonly name?: string; readonly linkType: string} & LinkFields
  >;
  readonly mainWideItem?: {readonly title?: string} & LinkFields;
  readonly subWideItemList?: ReadonlyArray<
    {readonly title: string} & LinkFields
  >;
  readonly carousel?: {
    readonly list?: ReadonlyArray<{
      readonly header?: string;
      readonly content?: string;
      readonly additionalContent?: string;
      readonly imageLink?: string;
      readonly buttons?: ReadonlyArray<
        {readonly name?: string; readonly linkType: string} & LinkFields
      >;
      readonly coupon?: {readonly description: string} & LinkFields;
    }>;
    readonly head?: {
      readonly header?: string;
      readonly content?: string;
    } & LinkFields;
    readonly tail?: LinkFields;
  };
};

const hasCoupon = (bms: BmsConstraintInput): boolean => bms.coupon != null;

/**
 * 쿠폰 설명 길이 검증
 * - 서버 에러와 동일 문구 사용: "쿠폰 설명은 최대 N자 이하로 입력해주세요."
 * - CAROUSEL_FEED/CAROUSEL_COMMERCE는 top-level coupon이 금지되고 per-item coupon만 허용됨
 */
export const validateCouponDescription = (
  bms: BmsConstraintInput,
): true | string => {
  const limit = BMS_COUPON_DESCRIPTION_MAX[bms.chatBubbleType];

  if (bms.coupon && bms.coupon.description.length > limit) {
    return `쿠폰 설명은 최대 ${limit}자 이하로 입력해주세요.`;
  }

  for (const item of bms.carousel?.list ?? []) {
    if (item.coupon && item.coupon.description.length > limit) {
      return `쿠폰 설명은 최대 ${limit}자 이하로 입력해주세요.`;
    }
  }

  return true;
};

const validateSingleButtonGroup = (
  chatBubbleType: BmsChatBubbleType,
  buttons: ReadonlyArray<{name?: string; linkType: string}>,
  withCoupon: boolean,
): true | string => {
  const range = BMS_BUTTON_COUNT[chatBubbleType];
  const max =
    withCoupon && range.maxWithCoupon != null ? range.maxWithCoupon : range.max;

  if (buttons.length > max) {
    if (withCoupon && range.maxWithCoupon != null) {
      return `${chatBubbleType} 타입에서는 쿠폰 사용 시 최대 ${max}개의 버튼만 사용할 수 있습니다.`;
    }
    return `${chatBubbleType} 타입에서는 최대 ${max}개의 버튼만 사용할 수 있습니다.`;
  }

  if (range.min != null && buttons.length < range.min) {
    return `${chatBubbleType} 타입에서는 최소 ${range.min}개의 버튼이 필요합니다.`;
  }

  return true;
};

/**
 * 버튼 개수 검증 (chatBubbleType/쿠폰 유무별)
 * - CAROUSEL_*는 캐러셀 리스트 아이템별 buttons에 대해 검사
 */
export const validateButtonCount = (bms: BmsConstraintInput): true | string => {
  const type = bms.chatBubbleType;
  const isCarousel = type === 'CAROUSEL_FEED' || type === 'CAROUSEL_COMMERCE';

  if (isCarousel) {
    for (const item of bms.carousel?.list ?? []) {
      const result = validateSingleButtonGroup(
        type,
        item.buttons ?? [],
        hasCoupon(bms) || item.coupon != null,
      );
      if (result !== true) return result;
    }
    return true;
  }

  if (!bms.buttons) return true;
  return validateSingleButtonGroup(type, bms.buttons, hasCoupon(bms));
};

/**
 * 버튼명 길이 검증 — TEXT/IMAGE 14자, 그 외 8자
 * AC(채널 추가) 타입은 서버가 name을 삭제하므로 검증 제외
 */
export const validateButtonNames = (bms: BmsConstraintInput): true | string => {
  const type = bms.chatBubbleType;
  const limit = BMS_BUTTON_NAME_MAX[type];

  const checkList = (
    buttons: ReadonlyArray<{name?: string; linkType: string}>,
  ): true | string => {
    for (const button of buttons) {
      if (button.linkType === 'AC') continue;
      if (button.name != null && button.name.length > limit) {
        return `${type} 타입 button.name은 최대 ${limit}자 이하로 입력해주세요.`;
      }
    }
    return true;
  };

  if (bms.buttons) {
    const result = checkList(bms.buttons);
    if (result !== true) return result;
  }

  for (const item of bms.carousel?.list ?? []) {
    const result = checkList(item.buttons ?? []);
    if (result !== true) return result;
  }

  return true;
};

/**
 * 허용 linkType 검증 — CAROUSEL/COMMERCE는 WL/AL 전용
 */
export const validateAllowedLinkTypes = (
  bms: BmsConstraintInput,
): true | string => {
  const type = bms.chatBubbleType;
  const allowed = BMS_ALLOWED_LINK_TYPES[type];
  if (!allowed) return true;

  const checkList = (
    buttons: ReadonlyArray<{linkType: string}>,
  ): true | string => {
    for (const button of buttons) {
      if (!allowed.includes(button.linkType as LinkType)) {
        return `${type} 타입에서는 ${allowed.join(', ')} 타입의 버튼만 사용할 수 있습니다.`;
      }
    }
    return true;
  };

  if (bms.buttons) {
    const result = checkList(bms.buttons);
    if (result !== true) return result;
  }

  for (const item of bms.carousel?.list ?? []) {
    const result = checkList(item.buttons ?? []);
    if (result !== true) return result;
  }

  return true;
};

const lengthError = (
  chatBubbleType: BmsChatBubbleType,
  fieldName: string,
  max: number,
): string =>
  `${chatBubbleType} 타입 ${fieldName}은 최대 ${max}자 이하로 입력해주세요.`;

/**
 * 각 텍스트 필드 길이 검증 (header, content, additionalContent, titles, carousel 텍스트)
 */
export const validateTextLengths = (bms: BmsConstraintInput): true | string => {
  const type = bms.chatBubbleType;

  if (bms.header != null && bms.header.length > BMS_HEADER_MAX) {
    return lengthError(type, 'header', BMS_HEADER_MAX);
  }

  const contentLimit = BMS_CONTENT_MAX[type];
  if (
    contentLimit != null &&
    bms.content != null &&
    bms.content.length > contentLimit
  ) {
    return lengthError(type, 'content', contentLimit);
  }

  if (
    bms.additionalContent != null &&
    bms.additionalContent.length > BMS_ADDITIONAL_CONTENT_MAX
  ) {
    return lengthError(type, 'additionalContent', BMS_ADDITIONAL_CONTENT_MAX);
  }

  if (
    bms.mainWideItem?.title != null &&
    bms.mainWideItem.title.length > BMS_MAIN_WIDE_ITEM_TITLE_MAX
  ) {
    return lengthError(
      type,
      'mainWideItem.title',
      BMS_MAIN_WIDE_ITEM_TITLE_MAX,
    );
  }

  for (const sub of bms.subWideItemList ?? []) {
    if (sub.title.length > BMS_SUB_WIDE_ITEM_TITLE_MAX) {
      return lengthError(
        type,
        'subWideItem.title',
        BMS_SUB_WIDE_ITEM_TITLE_MAX,
      );
    }
  }

  if (bms.carousel?.head) {
    const {header, content} = bms.carousel.head;
    if (header != null && header.length > BMS_HEADER_MAX) {
      return lengthError(type, 'carousel.head.header', BMS_HEADER_MAX);
    }
    if (content != null && content.length > BMS_CAROUSEL_HEAD_CONTENT_MAX) {
      return lengthError(
        type,
        'carousel.head.content',
        BMS_CAROUSEL_HEAD_CONTENT_MAX,
      );
    }
  }

  if (type === 'CAROUSEL_FEED') {
    for (const item of bms.carousel?.list ?? []) {
      if (item.header != null && item.header.length > BMS_HEADER_MAX) {
        return lengthError(type, 'carousel.list.header', BMS_HEADER_MAX);
      }
      if (
        item.content != null &&
        item.content.length > BMS_CAROUSEL_FEED_ITEM_CONTENT_MAX
      ) {
        return lengthError(
          type,
          'carousel.list.content',
          BMS_CAROUSEL_FEED_ITEM_CONTENT_MAX,
        );
      }
    }
  }

  if (type === 'CAROUSEL_COMMERCE') {
    for (const item of bms.carousel?.list ?? []) {
      if (
        item.additionalContent != null &&
        item.additionalContent.length >
          BMS_CAROUSEL_COMMERCE_ADDITIONAL_CONTENT_MAX
      ) {
        return lengthError(
          type,
          'carousel.list.additionalContent',
          BMS_CAROUSEL_COMMERCE_ADDITIONAL_CONTENT_MAX,
        );
      }
    }
  }

  return true;
};

/**
 * 캐러셀 리스트 개수 검증
 * - head 有: 1~5
 * - head 無: 2~6
 */
export const validateCarouselListCount = (
  bms: BmsConstraintInput,
): true | string => {
  const type = bms.chatBubbleType;
  if (type !== 'CAROUSEL_FEED' && type !== 'CAROUSEL_COMMERCE') return true;

  const list = bms.carousel?.list ?? [];
  const hasHead = bms.carousel?.head != null;
  const range = hasHead
    ? BMS_CAROUSEL_LIST_RANGE.withHead
    : BMS_CAROUSEL_LIST_RANGE.withoutHead;

  if (list.length < range.min || list.length > range.max) {
    const prefix = hasHead
      ? '캐러셀 인트로가 있는 경우 캐러셀 리스트는'
      : '캐러셀 리스트는';
    return `${prefix} 최소 ${range.min}개, 최대 ${range.max}개까지 가능합니다.`;
  }

  return true;
};

const countNewlines = (text: string): number => {
  const matches = text.match(/\r\n|\r|\n/g);
  return matches ? matches.length : 0;
};

const newlineError = (
  chatBubbleType: BmsChatBubbleType,
  fieldName: string,
  max: number,
): string =>
  `${chatBubbleType} 타입 ${fieldName}은 줄바꿈 최대 ${max}개 까지 가능합니다.`;

const contentNewlineLimit = (type: BmsChatBubbleType): number | null => {
  if (type === 'TEXT' || type === 'IMAGE') return 99;
  if (type === 'WIDE' || type === 'PREMIUM_VIDEO') return 1;
  return null;
};

/**
 * 줄바꿈 개수 검증
 * - 서버 에러와 동일 문구 사용: "${field}은 줄바꿈 최대 N개 까지 가능합니다."
 */
export const validateNewlineLimits = (
  bms: BmsConstraintInput,
): true | string => {
  const type = bms.chatBubbleType;

  if (bms.header != null && countNewlines(bms.header) > 0) {
    return newlineError(type, 'header', 0);
  }

  const contentNL = contentNewlineLimit(type);
  if (
    contentNL != null &&
    bms.content != null &&
    countNewlines(bms.content) > contentNL
  ) {
    return newlineError(type, 'content', contentNL);
  }

  if (
    bms.mainWideItem?.title != null &&
    countNewlines(bms.mainWideItem.title) > 1
  ) {
    return newlineError(type, 'mainWideItem.title', 1);
  }

  for (const sub of bms.subWideItemList ?? []) {
    if (countNewlines(sub.title) > 1) {
      return newlineError(type, 'subWideItem.title', 1);
    }
  }

  if (bms.carousel?.head) {
    const {header, content} = bms.carousel.head;
    if (header != null && countNewlines(header) > 0) {
      return newlineError(type, 'carousel.head.header', 0);
    }
    if (content != null && countNewlines(content) > 2) {
      return newlineError(type, 'carousel.head.content', 2);
    }
  }

  for (const item of bms.carousel?.list ?? []) {
    if (item.header != null && countNewlines(item.header) > 0) {
      return newlineError(type, 'carousel.list.header', 0);
    }
    if (
      type === 'CAROUSEL_FEED' &&
      item.content != null &&
      countNewlines(item.content) > 2
    ) {
      return newlineError(type, 'carousel.list.content', 2);
    }
    if (
      type === 'CAROUSEL_COMMERCE' &&
      item.additionalContent != null &&
      countNewlines(item.additionalContent) > 1
    ) {
      return newlineError(type, 'carousel.list.additionalContent', 1);
    }
  }

  return true;
};

// 서버 URL 검증 regex와 일치 — domain.tld 구조 요구
const HTTP_URL_PATTERN =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,64}\.[a-z0-9]{1,64}\b([-a-zA-Z0-9@:%~_~+.~#?&//=]*)/i;
const HTTP_PREFIX_PATTERN = /^https?:\/\//i;
const VARIABLE_IN_LINK_PATTERN = /#\{((?!(#{|})).)+\}/;

/**
 * 링크 URL 형식 검증
 * - 정상 http(s) URL이거나, http(s):// 시작 + `#{변수}` 포함 시 통과
 */
const isValidLink = (link: string): boolean => {
  if (HTTP_URL_PATTERN.test(link)) return true;
  return HTTP_PREFIX_PATTERN.test(link) && VARIABLE_IN_LINK_PATTERN.test(link);
};

const checkLinkPair = (obj: LinkFields | undefined): true | string => {
  if (!obj) return true;
  if (obj.linkPc && !isValidLink(obj.linkPc)) {
    return 'linkPc 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.';
  }
  if (obj.linkMobile && !isValidLink(obj.linkMobile)) {
    return 'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.';
  }
  return true;
};

const IMAGE_LINK_ERROR =
  'imageLink 값이 잘못되었습니다. http:// 또는 https:// 로 시작하는 정상적인 주소를 올려주세요.';

const checkImageLink = (imageLink: string | undefined): true | string => {
  if (!imageLink) return true;
  return isValidLink(imageLink) ? true : IMAGE_LINK_ERROR;
};

/**
 * 링크 필드 전체 검증 (linkPc/linkMobile/imageLink)
 * - linkAndroid/linkIos는 앱 스키마라 레퍼런스도 검증 안함
 */
export const validateLinks = (bms: BmsConstraintInput): true | string => {
  const imageLinkResult = checkImageLink(bms.imageLink);
  if (imageLinkResult !== true) return imageLinkResult;

  const couponResult = checkLinkPair(bms.coupon);
  if (couponResult !== true) return couponResult;

  for (const button of bms.buttons ?? []) {
    const r = checkLinkPair(button);
    if (r !== true) return r;
  }

  const mainResult = checkLinkPair(bms.mainWideItem);
  if (mainResult !== true) return mainResult;

  for (const sub of bms.subWideItemList ?? []) {
    const r = checkLinkPair(sub);
    if (r !== true) return r;
  }

  const headResult = checkLinkPair(bms.carousel?.head);
  if (headResult !== true) return headResult;

  const tailResult = checkLinkPair(bms.carousel?.tail);
  if (tailResult !== true) return tailResult;

  for (const item of bms.carousel?.list ?? []) {
    const imageResult = checkImageLink(item.imageLink);
    if (imageResult !== true) return imageResult;
    for (const button of item.buttons ?? []) {
      const r = checkLinkPair(button);
      if (r !== true) return r;
    }
    const itemCouponResult = checkLinkPair(item.coupon);
    if (itemCouponResult !== true) return itemCouponResult;
  }

  return true;
};

const FORBIDDEN_VARIABLE_PATTERN = /#\{((?!(#{|})).)+\}/;

/**
 * 변수 금지 검증
 * - `#{...}` 변수 포함 시 거부 (서버 규칙과 일치)
 * - 적용 대상: button.name, carousel.tail의 모든 링크
 */
export const validateForbiddenVariables = (
  bms: BmsConstraintInput,
): true | string => {
  const checkButtons = (
    buttons: ReadonlyArray<{name?: string; linkType: string}>,
  ): true | string => {
    for (const button of buttons) {
      if (button.name && FORBIDDEN_VARIABLE_PATTERN.test(button.name)) {
        return 'button.name에는 변수를 사용할 수 없습니다.';
      }
    }
    return true;
  };

  if (bms.buttons) {
    const r = checkButtons(bms.buttons);
    if (r !== true) return r;
  }

  for (const item of bms.carousel?.list ?? []) {
    const r = checkButtons(item.buttons ?? []);
    if (r !== true) return r;
  }

  const tail = bms.carousel?.tail;
  if (tail) {
    const linkKeys: ReadonlyArray<keyof LinkFields> = [
      'linkMobile',
      'linkPc',
      'linkAndroid',
      'linkIos',
    ];
    for (const key of linkKeys) {
      const value = tail[key];
      if (value && FORBIDDEN_VARIABLE_PATTERN.test(value)) {
        return `${key}에는 변수를 사용할 수 없습니다.`;
      }
    }
  }

  return true;
};

/**
 * chatBubbleType별 최상위 허용 필드
 * - 서버가 chatBubbleType마다 허용하는 필드 목록과 일치
 * - 여기 없는 필드는 서버가 거부하므로 SDK도 사전 차단
 * - targeting, chatBubbleType은 schema 필수라 별도 제외
 */
export const BMS_ACCEPTABLE_FIELDS: Record<
  BmsChatBubbleType,
  ReadonlyArray<string>
> = {
  TEXT: ['adult', 'content', 'buttons', 'coupon'],
  IMAGE: ['adult', 'content', 'imageId', 'imageLink', 'buttons', 'coupon'],
  WIDE: ['adult', 'content', 'imageId', 'buttons', 'coupon'],
  WIDE_ITEM_LIST: [
    'adult',
    'header',
    'mainWideItem',
    'subWideItemList',
    'buttons',
    'coupon',
  ],
  COMMERCE: [
    'adult',
    'additionalContent',
    'imageId',
    'commerce',
    'buttons',
    'coupon',
  ],
  CAROUSEL_FEED: ['adult', 'carousel'],
  CAROUSEL_COMMERCE: ['adult', 'additionalContent', 'carousel'],
  PREMIUM_VIDEO: ['adult', 'header', 'content', 'video', 'buttons', 'coupon'],
};

const RESERVED_FIELDS: ReadonlyArray<string> = ['targeting', 'chatBubbleType'];

/**
 * chatBubbleType별 허용 필드 외 reject
 */
export const validateAcceptableFields = (
  bms: BmsConstraintInput,
): true | string => {
  const type = bms.chatBubbleType;
  const acceptable = BMS_ACCEPTABLE_FIELDS[type];
  const allowed = new Set<string>([...acceptable, ...RESERVED_FIELDS]);

  const record = bms as unknown as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (record[key] == null) continue;
    if (!allowed.has(key)) {
      return `${type}타입 에서는 ${acceptable.join(', ')} 값만 사용이 가능합니다.`;
    }
  }
  return true;
};

const BMS_IMAGE_ID_MAX = 32;

/**
 * IMAGE 타입 imageId 공백 제거 후 32자 검증
 */
export const validateImageIdLength = (
  bms: BmsConstraintInput,
): true | string => {
  if (bms.chatBubbleType !== 'IMAGE') return true;
  if (!bms.imageId) return true;
  const trimmed = bms.imageId.replace(/\s/g, '');
  if (trimmed.length > BMS_IMAGE_ID_MAX) {
    return `IMAGE 타입 imageId은 최대 ${BMS_IMAGE_ID_MAX}자 이하로 입력해주세요.`;
  }
  return true;
};
