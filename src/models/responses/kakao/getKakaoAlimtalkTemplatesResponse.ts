import {
  KakaoAlimtalkTemplateSchema,
  kakaoAlimtalkTemplateSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {Schema} from 'effect';
import {GetKakaoTemplateResponse} from './getKakaoTemplateResponse';

export const getKakaoAlimtalkTemplatesResponseSchema = Schema.Struct({
  limit: Schema.Number,
  templateList: Schema.Array(kakaoAlimtalkTemplateSchema),
  startKey: Schema.String,
  nextKey: Schema.NullOr(Schema.String),
});

export type GetKakaoAlimtalkTemplatesResponseSchema = Schema.Schema.Type<
  typeof getKakaoAlimtalkTemplatesResponseSchema
>;

export interface GetKakaoAlimtalkTemplatesResponse {
  limit: number;
  templateList: Array<GetKakaoTemplateResponse>;
  startKey: string;
  nextKey: string | null;
}

export interface GetKakaoAlimtalkTemplatesFinalizeResponse {
  limit: number;
  templateList: Array<KakaoAlimtalkTemplateSchema>;
  startKey: string;
  nextKey: string | null;
}
