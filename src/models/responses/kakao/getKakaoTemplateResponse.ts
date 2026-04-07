import {
  kakaoAlimtalkTemplateAssignTypeSchema,
  kakaoAlimtalkTemplateSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {Schema} from 'effect';

export const getKakaoTemplateResponseSchema = Schema.extend(
  kakaoAlimtalkTemplateSchema,
  Schema.Struct({
    assignType: kakaoAlimtalkTemplateAssignTypeSchema,
    accountId: Schema.String,
    commentable: Schema.Boolean,
    dateCreated: Schema.String,
    dateUpdated: Schema.String,
  }),
);
export type GetKakaoTemplateResponse = Schema.Schema.Type<
  typeof getKakaoTemplateResponseSchema
>;
