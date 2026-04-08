import {
  kakaoAlimtalkTemplateEmphasizeTypeSchema,
  kakaoAlimtalkTemplateHighlightTypeSchema,
  kakaoAlimtalkTemplateItemTypeSchema,
  kakaoAlimtalkTemplateMessageTypeSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {kakaoAlimtalkTemplateQuickReplySchema} from '@models/base/kakao/kakaoAlimtalkTemplateQuickReply';
import {kakaoButtonSchema} from '@models/base/kakao/kakaoButton';
import {Schema} from 'effect';

export const updateKakaoAlimtalkTemplateRequestSchema = Schema.Struct({
  name: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),
  categoryCode: Schema.optional(Schema.String),
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
export type UpdateKakaoAlimtalkTemplateRequest = Schema.Schema.Type<
  typeof updateKakaoAlimtalkTemplateRequestSchema
>;
