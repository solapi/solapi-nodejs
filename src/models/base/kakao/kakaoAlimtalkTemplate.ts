import {type InvalidDateError} from '@errors/defaultError';
import {safeDateTransfer} from '@lib/schemaUtils';
import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {kakaoAlimtalkTemplateQuickReplySchema} from './kakaoAlimtalkTemplateQuickReply';
import {kakaoButtonSchema} from './kakaoButton';
import {type KakaoChannelCategory} from './kakaoChannel';

/**
 * @description 카카오 채널 카테고리 타입
 */
export type KakaoAlimtalkTemplateCategory = KakaoChannelCategory;

export const kakaoAlimtalkTemplateMessageTypeSchema = Schema.Literal(
  'BA',
  'EX',
  'AD',
  'MI',
);
export type KakaoAlimtalkTemplateMessageType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateMessageTypeSchema
>;

export const kakaoAlimtalkTemplateEmphasizeTypeSchema = Schema.Literal(
  'NONE',
  'TEXT',
  'IMAGE',
  'ITEM_LIST',
);
export type KakaoAlimtalkTemplateEmphasizeType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateEmphasizeTypeSchema
>;

export const kakaoAlimtalkTemplateAssignTypeSchema = Schema.Literal(
  'CHANNEL',
  'GROUP',
);
export type KakaoAlimtalkTemplateAssignType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateAssignTypeSchema
>;

export const kakaoAlimtalkTemplateStatusSchema = Schema.Literal(
  'PENDING',
  'INSPECTING',
  'APPROVED',
  'REJECTED',
);
export type KakaoAlimtalkTemplateStatus = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateStatusSchema
>;

export const kakaoAlimtalkTemplateCommentTypeSchema = Schema.Struct({
  isAdmin: Schema.Boolean,
  memberId: Schema.String,
  content: Schema.NullOr(Schema.String),
  dateCreated: Schema.String,
});
export type KakaoAlimtalkTemplateCommentType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateCommentTypeSchema
>;

export const kakaoAlimtalkTemplateHighlightTypeSchema = Schema.Struct({
  title: Schema.optional(Schema.NullOr(Schema.String)),
  description: Schema.optional(Schema.NullOr(Schema.String)),
  imageId: Schema.optional(Schema.NullOr(Schema.String)),
});
export type KakaoAlimtalkTemplateHighlightType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateHighlightTypeSchema
>;

export const kakaoAlimtalkTemplateItemTypeSchema = Schema.Struct({
  list: Schema.Array(
    Schema.Struct({
      title: Schema.String,
      description: Schema.String,
    }),
  ),
  summary: Schema.Struct({
    title: Schema.optional(Schema.NullOr(Schema.String)),
    description: Schema.optional(Schema.NullOr(Schema.String)),
  }),
});
export type KakaoAlimtalkTemplateItemType = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateItemTypeSchema
>;

export const kakaoAlimtalkTemplateSchema = Schema.Struct({
  name: Schema.String,
  channelId: Schema.optional(Schema.NullOr(Schema.String)),
  channelGroupId: Schema.optional(Schema.NullOr(Schema.String)),
  content: Schema.optional(Schema.String),
  isHidden: Schema.optional(Schema.Boolean),
  messageType: kakaoAlimtalkTemplateMessageTypeSchema,
  emphasizeType: kakaoAlimtalkTemplateEmphasizeTypeSchema,
  extra: Schema.optional(Schema.NullOr(Schema.String)),
  ad: Schema.optional(Schema.NullOr(Schema.String)),
  emphasizeTitle: Schema.optional(Schema.NullOr(Schema.String)),
  emphasizeSubtitle: Schema.optional(Schema.NullOr(Schema.String)),
  securityFlag: Schema.Boolean,
  imageId: Schema.optional(Schema.NullOr(Schema.String)),
  assignType: Schema.optional(kakaoAlimtalkTemplateAssignTypeSchema),
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
  comments: Schema.optional(
    Schema.Array(kakaoAlimtalkTemplateCommentTypeSchema),
  ),
  commentable: Schema.optional(Schema.Boolean),
  quickReplies: Schema.optional(
    Schema.Array(kakaoAlimtalkTemplateQuickReplySchema),
  ),
  header: Schema.optional(Schema.NullOr(Schema.String)),
  highlight: Schema.optional(
    Schema.NullOr(kakaoAlimtalkTemplateHighlightTypeSchema),
  ),
  item: Schema.optional(Schema.NullOr(kakaoAlimtalkTemplateItemTypeSchema)),
  templateId: Schema.String,
  code: Schema.optional(Schema.NullOr(Schema.String)),
  status: kakaoAlimtalkTemplateStatusSchema,
  variables: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
      }),
    ),
  ),
  dateCreated: Schema.optional(
    Schema.Union(Schema.String, Schema.DateFromSelf),
  ),
  dateUpdated: Schema.optional(
    Schema.Union(Schema.String, Schema.DateFromSelf),
  ),
});

export type KakaoAlimtalkTemplateSchema = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateSchema
>;

/**
 * 날짜가 Date로 변환된 알림톡 템플릿 타입
 */
export type KakaoAlimtalkTemplate = Omit<
  KakaoAlimtalkTemplateSchema,
  'dateCreated' | 'dateUpdated'
> & {
  dateCreated?: Date;
  dateUpdated?: Date;
};

/**
 * API 응답 데이터를 KakaoAlimtalkTemplate 타입으로 변환 (Effect 반환)
 */
export function decodeKakaoAlimtalkTemplate(
  data: KakaoAlimtalkTemplateSchema,
): Effect.Effect<KakaoAlimtalkTemplate, InvalidDateError> {
  return Effect.gen(function* () {
    const dateCreated = yield* safeDateTransfer(data.dateCreated);
    const dateUpdated = yield* safeDateTransfer(data.dateUpdated);
    return {
      ...data,
      dateCreated,
      dateUpdated,
    };
  });
}
