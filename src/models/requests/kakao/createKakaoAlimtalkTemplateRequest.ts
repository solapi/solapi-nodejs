import {
  kakaoAlimtalkTemplateEmphasizeTypeSchema,
  kakaoAlimtalkTemplateHighlightTypeSchema,
  kakaoAlimtalkTemplateItemTypeSchema,
  kakaoAlimtalkTemplateMessageTypeSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {kakaoAlimtalkTemplateQuickReplySchema} from '@models/base/kakao/kakaoAlimtalkTemplateQuickReply';
import {kakaoButtonSchema} from '@models/base/kakao/kakaoButton';
import {Schema} from 'effect';

const baseKakaoAlimtalkTemplateRequestSchema = Schema.Struct({
  name: Schema.String,
  content: Schema.String,
  categoryCode: Schema.String,
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
  quickReplies: Schema.optional(
    Schema.Array(kakaoAlimtalkTemplateQuickReplySchema),
  ),
  messageType: Schema.optional(kakaoAlimtalkTemplateMessageTypeSchema),
  emphasizeType: Schema.optional(kakaoAlimtalkTemplateEmphasizeTypeSchema),
  header: Schema.optional(Schema.String),
  highlight: Schema.optional(kakaoAlimtalkTemplateHighlightTypeSchema),
  item: Schema.optional(kakaoAlimtalkTemplateItemTypeSchema),
  extra: Schema.optional(Schema.String),
  emphasizeTitle: Schema.optional(Schema.String),
  emphasizeSubTitle: Schema.optional(Schema.String),
  securityFlag: Schema.optional(Schema.Boolean),
  imageId: Schema.optional(Schema.String),
});

export type BaseKakaoAlimtalkTemplateRequest = Schema.Schema.Type<
  typeof baseKakaoAlimtalkTemplateRequestSchema
>;

const createKakaoChannelAlimtalkTemplateRequestSchema = Schema.extend(
  baseKakaoAlimtalkTemplateRequestSchema,
  Schema.Struct({channelId: Schema.String}),
);

const createKakaoChannelGroupAlimtalkTemplateRequestSchema = Schema.extend(
  baseKakaoAlimtalkTemplateRequestSchema,
  Schema.Struct({channelGroupId: Schema.String}),
);

export const createKakaoAlimtalkTemplateRequestSchema = Schema.Union(
  createKakaoChannelAlimtalkTemplateRequestSchema,
  createKakaoChannelGroupAlimtalkTemplateRequestSchema,
);
export type CreateKakaoAlimtalkTemplateRequest = Schema.Schema.Type<
  typeof createKakaoAlimtalkTemplateRequestSchema
>;
