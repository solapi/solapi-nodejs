import {Schema} from 'effect';

/**
 * BMS 비디오 정보 타입 (PREMIUM_VIDEO용)
 */
export type BmsVideo = {
  videoId: string;
  thumbImageId: string;
};

/**
 * BMS 비디오 정보 스키마
 * - videoId: 비디오 ID (필수)
 * - thumbImageId: 썸네일 이미지 ID (필수)
 */
export const bmsVideoSchema = Schema.Struct({
  videoId: Schema.String,
  thumbImageId: Schema.String,
});

export type BmsVideoSchema = Schema.Schema.Type<typeof bmsVideoSchema>;
