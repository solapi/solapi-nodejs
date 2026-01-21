import path from 'path';
import type {
  BmsCarouselCommerceItemSchema,
  BmsCarouselFeedItemSchema,
  BmsMainWideItemSchema,
  BmsSubWideItemSchema,
} from '@/models/base/kakao/bms';
import type {BmsChatBubbleType} from '@/models/base/kakao/kakaoOption';
import type {FileType} from '@/models/requests/messages/groupMessageRequest';
import type StorageService from '@/services/storage/storageService';

/**
 * BMS chatBubbleType별 이미지 업로드 타입 매핑
 */
export const BMS_IMAGE_TYPES = {
  TEXT: 'KAKAO', // 이미지 불필요
  IMAGE: 'BMS',
  WIDE: 'BMS_WIDE',
  WIDE_ITEM_LIST_MAIN: 'BMS_WIDE_MAIN_ITEM_LIST',
  WIDE_ITEM_LIST_SUB: 'BMS_WIDE_SUB_ITEM_LIST',
  COMMERCE: 'BMS',
  CAROUSEL_FEED: 'BMS_CAROUSEL_FEED_LIST',
  CAROUSEL_COMMERCE: 'BMS_CAROUSEL_COMMERCE_LIST',
  PREMIUM_VIDEO: 'KAKAO', // 동영상 썸네일용 (선택)
} as const;

export type BmsImageType =
  (typeof BMS_IMAGE_TYPES)[keyof typeof BMS_IMAGE_TYPES];

/**
 * BMS 테스트용 유틸리티 함수들
 */

/**
 * BMS 옵션 생성 헬퍼
 */
export const createBmsOption = (
  chatBubbleType: BmsChatBubbleType,
  overrides: Record<string, unknown> = {},
) => ({
  targeting: 'I' as const,
  chatBubbleType,
  ...overrides,
});

/**
 * BMS Commerce 데이터 생성 헬퍼
 */
export const createBmsCommerce = (
  overrides: {
    title?: string;
    regularPrice?: number;
    discountPrice?: number;
    discountRate?: number;
    discountFixed?: number;
  } = {},
) => ({
  title: '테스트 상품',
  regularPrice: 10000,
  ...overrides,
});

/**
 * BMS 쿠폰 생성 헬퍼
 * 5가지 프리셋 중 하나로 생성
 */
type CouponTitleType =
  | 'won' // N원 할인 쿠폰
  | 'percent' // N% 할인 쿠폰
  | 'shipping' // 배송비 할인 쿠폰
  | 'free' // OOO 무료 쿠폰
  | 'up'; // OOO UP 쿠폰

export const createBmsCoupon = (titleType: CouponTitleType = 'won') => {
  const titles: Record<CouponTitleType, string> = {
    won: '10000원 할인 쿠폰',
    percent: '10% 할인 쿠폰',
    shipping: '배송비 할인 쿠폰',
    free: '첫구매 무료 쿠폰',
    up: '포인트 UP 쿠폰',
  };

  return {
    title: titles[titleType],
    description: '테스트 쿠폰',
    linkMobile: 'https://example.com/coupon',
  };
};

/**
 * BMS 버튼 생성 헬퍼
 * linkType별로 생성
 */
type ButtonLinkType = 'WL' | 'AL' | 'AC' | 'BK' | 'MD' | 'BC' | 'BT' | 'BF';

export const createBmsButton = (linkType: ButtonLinkType) => {
  switch (linkType) {
    case 'WL':
      return {
        name: '웹링크 버튼',
        linkType: 'WL' as const,
        linkMobile: 'https://example.com',
        linkPc: 'https://example.com',
      };
    case 'AL':
      return {
        name: '앱링크 버튼',
        linkType: 'AL' as const,
        linkMobile: 'https://example.com',
        linkAndroid: 'examplescheme://path',
        linkIos: 'examplescheme://path',
      };
    case 'AC':
      return {
        name: '채널 추가',
        linkType: 'AC' as const,
      };
    case 'BK':
      return {
        name: '봇 키워드',
        linkType: 'BK' as const,
        chatExtra: 'test_keyword',
      };
    case 'MD':
      return {
        name: '메시지 전달',
        linkType: 'MD' as const,
        chatExtra: 'test_message',
      };
    case 'BC':
      return {
        name: '상담 요청',
        linkType: 'BC' as const,
        chatExtra: 'test_consult',
      };
    case 'BT':
      return {
        name: '봇 전환',
        linkType: 'BT' as const,
        chatExtra: 'test_bot',
      };
    case 'BF':
      return {
        name: '비즈니스폼',
        linkType: 'BF' as const,
      };
  }
};

/**
 * BMS 링크 버튼 생성 헬퍼 (캐러셀용 - WL, AL만 지원)
 */
export const createBmsLinkButton = (linkType: 'WL' | 'AL' = 'WL') => {
  if (linkType === 'WL') {
    return {
      name: '웹링크 버튼',
      linkType: 'WL' as const,
      linkMobile: 'https://example.com',
      linkPc: 'https://example.com',
    };
  }
  return {
    name: '앱링크 버튼',
    linkType: 'AL' as const,
    linkMobile: 'https://example.com',
    linkAndroid: 'examplescheme://path',
    linkIos: 'examplescheme://path',
  };
};

/**
 * 캐러셀 피드 아이템 생성 헬퍼
 */
export const createCarouselFeedItem = (
  imageId: string,
  overrides: Partial<BmsCarouselFeedItemSchema> = {},
): BmsCarouselFeedItemSchema => ({
  header: '캐러셀 헤더',
  content: '캐러셀 내용입니다.',
  imageId,
  buttons: [createBmsLinkButton('WL')],
  ...overrides,
});

/**
 * 캐러셀 커머스 아이템 생성 헬퍼
 */
export const createCarouselCommerceItem = (
  imageId: string,
  overrides: Partial<BmsCarouselCommerceItemSchema> = {},
): BmsCarouselCommerceItemSchema => ({
  commerce: createBmsCommerce(),
  imageId,
  buttons: [createBmsLinkButton('WL')],
  ...overrides,
});

/**
 * 메인 와이드 아이템 생성 헬퍼
 */
export const createMainWideItem = (
  imageId: string,
  overrides: Partial<BmsMainWideItemSchema> = {},
): BmsMainWideItemSchema => ({
  title: '메인 아이템',
  imageId,
  linkMobile: 'https://example.com/main',
  ...overrides,
});

/**
 * 서브 와이드 아이템 생성 헬퍼
 */
export const createSubWideItem = (
  imageId: string,
  title: string,
  overrides: Partial<BmsSubWideItemSchema> = {},
): BmsSubWideItemSchema => ({
  title,
  imageId,
  linkMobile: 'https://example.com/sub',
  ...overrides,
});

/**
 * BMS 이미지 업로드 헬퍼 (타입 지정 가능)
 */
export const uploadBmsImage = async (
  storageService: StorageService,
  imagePath: string,
  fileType: FileType = 'KAKAO',
): Promise<string> => {
  const result = await storageService.uploadFile(imagePath, fileType);
  return result.fileId;
};

/**
 * BMS chatBubbleType별 이미지 업로드 헬퍼 모음
 */
export const uploadBmsImageForType = {
  /** IMAGE, COMMERCE용 이미지 업로드 */
  bms: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS'),
  /** WIDE용 이미지 업로드 */
  wide: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS_WIDE'),
  /** WIDE_ITEM_LIST 메인 아이템용 이미지 업로드 */
  wideMainItem: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS_WIDE_MAIN_ITEM_LIST'),
  /** WIDE_ITEM_LIST 서브 아이템용 이미지 업로드 */
  wideSubItem: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS_WIDE_SUB_ITEM_LIST'),
  /** CAROUSEL_FEED용 이미지 업로드 */
  carouselFeed: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS_CAROUSEL_FEED_LIST'),
  /** CAROUSEL_COMMERCE용 이미지 업로드 */
  carouselCommerce: (storageService: StorageService, imagePath: string) =>
    uploadBmsImage(storageService, imagePath, 'BMS_CAROUSEL_COMMERCE_LIST'),
};

/**
 * 테스트용 기본 이미지 경로 반환
 */
export const getTestImagePath = (dirname: string): string => {
  return path.resolve(
    dirname,
    '../../../examples/javascript/common/images/example.jpg',
  );
};

/**
 * 테스트용 2:1 비율 이미지 경로 반환 (BMS WIDE_SUB_ITEM_LIST 등)
 */
export const getTestImagePath2to1 = (dirname: string): string => {
  return path.resolve(dirname, '../../../test/assets/example-2to1.jpg');
};

/**
 * 테스트용 1:1 비율 이미지 경로 반환 (BMS WIDE_MAIN_ITEM_LIST)
 */
export const getTestImagePath1to1 = (dirname: string): string => {
  return path.resolve(dirname, '../../../test/assets/example-1to1.jpg');
};
