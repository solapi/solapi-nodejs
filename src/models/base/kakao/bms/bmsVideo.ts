import {Schema} from 'effect';

const KAKAO_TV_URL_PREFIX = 'https://tv.kakao.com/';

/**
 * 카카오 TV URL 검증
 */
const isKakaoTvUrl = (url: string): boolean =>
  url.startsWith(KAKAO_TV_URL_PREFIX);

/**
 * BMS 비디오 정보 타입 (PREMIUM_VIDEO용)
 */
export type BmsVideo = {
  videoUrl: string;
  imageId?: string;
  imageLink?: string;
};

/**
 * BMS 비디오 정보 스키마
 * - videoUrl: 카카오TV 동영상 URL (필수, https://tv.kakao.com/으로 시작)
 * - imageId: 썸네일 이미지 ID (선택)
 * - imageLink: 이미지 클릭 시 이동할 링크 (선택)
 */
export const bmsVideoSchema = Schema.Struct({
  videoUrl: Schema.String.pipe(
    Schema.filter(isKakaoTvUrl, {
      message: () =>
        `videoUrl은 '${KAKAO_TV_URL_PREFIX}'으로 시작하는 카카오TV 동영상 링크여야 합니다.`,
    }),
  ),
  imageId: Schema.optional(Schema.String),
  imageLink: Schema.optional(Schema.String),
});

export type BmsVideoSchema = Schema.Schema.Type<typeof bmsVideoSchema>;
