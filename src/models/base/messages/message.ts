import {baseKakaoOptionSchema} from '@models/base/kakao/kakaoOption';
import {naverOptionSchema} from '@models/base/naver/naverOption';
import {rcsOptionSchema} from '@models/base/rcs/rcsOption';
import {Schema} from 'effect';
import {voiceOptionSchema} from '@/models/requests/voice/voiceOption';

export const messageTypeSchema = Schema.Literal(
  'SMS',
  'LMS',
  'MMS',
  'ATA',
  'CTA',
  'CTI',
  'NSA',
  'RCS_SMS',
  'RCS_LMS',
  'RCS_MMS',
  'RCS_TPL',
  'RCS_ITPL',
  'RCS_LTPL',
  'FAX',
  'VOICE',
  'BMS_TEXT',
  'BMS_IMAGE',
  'BMS_WIDE',
  'BMS_WIDE_ITEM_LIST',
  'BMS_CAROUSEL_FEED',
  'BMS_PREMIUM_VIDEO',
  'BMS_COMMERCE',
  'BMS_CAROUSEL_COMMERCE',
  'BMS_FREE',
);

export type MessageType = Schema.Schema.Type<typeof messageTypeSchema>;

export const messageSchema = Schema.Struct({
  to: Schema.Union(Schema.String, Schema.Array(Schema.String)),
  from: Schema.optional(Schema.String),
  text: Schema.optional(Schema.String),
  imageId: Schema.optional(Schema.String),
  type: Schema.optional(messageTypeSchema),
  subject: Schema.optional(Schema.String),
  autoTypeDetect: Schema.optional(Schema.Boolean),
  kakaoOptions: Schema.optional(baseKakaoOptionSchema),
  rcsOptions: Schema.optional(rcsOptionSchema),
  country: Schema.optional(Schema.String),
  replacements: Schema.optional(Schema.Array(Schema.Struct({}))),
  customFields: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  naverOptions: Schema.optional(naverOptionSchema),
  faxOptions: Schema.optional(
    Schema.Struct({fileIds: Schema.Array(Schema.String)}),
  ),
  voiceOptions: Schema.optional(voiceOptionSchema),
});

export type MessageSchema = Schema.Schema.Type<typeof messageSchema>;
