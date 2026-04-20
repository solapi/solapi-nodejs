import {Schema} from 'effect';

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
