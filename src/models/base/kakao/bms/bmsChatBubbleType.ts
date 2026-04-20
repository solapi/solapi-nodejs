import {Schema} from 'effect';

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
