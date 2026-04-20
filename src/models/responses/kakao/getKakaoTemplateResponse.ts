import {
  kakaoAlimtalkTemplateAssignTypeSchema,
  kakaoAlimtalkTemplateSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {Schema} from 'effect';

export const getKakaoTemplateResponseSchema = kakaoAlimtalkTemplateSchema.pipe(
  Schema.omit('assignType', 'commentable', 'dateCreated', 'dateUpdated'),
  Schema.extend(
    Schema.Struct({
      assignType: kakaoAlimtalkTemplateAssignTypeSchema,
      accountId: Schema.NullishOr(Schema.String),
      commentable: Schema.Boolean,
      dateCreated: Schema.String,
      dateUpdated: Schema.String,
    }),
  ),
);
export type GetKakaoTemplateResponse = Schema.Schema.Type<
  typeof getKakaoTemplateResponseSchema
>;
