import {type KakaoAlimtalkTemplate} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {Schema} from 'effect';
import {getKakaoTemplateResponseSchema} from './getKakaoTemplateResponse';

export const getKakaoAlimtalkTemplatesResponseSchema = Schema.Struct({
  limit: Schema.Number,
  templateList: Schema.Array(getKakaoTemplateResponseSchema),
  startKey: Schema.String,
  nextKey: Schema.NullOr(Schema.String),
});
export type GetKakaoAlimtalkTemplatesResponseSchema = Schema.Schema.Type<
  typeof getKakaoAlimtalkTemplatesResponseSchema
>;
export type GetKakaoAlimtalkTemplatesResponse =
  GetKakaoAlimtalkTemplatesResponseSchema;

export type GetKakaoAlimtalkTemplatesFinalizeResponse = {
  limit: number;
  templateList: Array<KakaoAlimtalkTemplate>;
  startKey: string;
  nextKey: string | null;
};
