import {kakaoButtonSchema} from '@models/base/kakao/kakaoButton';
import {Schema} from 'effect';

export const kakaoOptionRequestSchema = Schema.Struct({
  pfId: Schema.String,
  templateId: Schema.optional(Schema.String),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  disableSms: Schema.optional(Schema.Boolean),
  adFlag: Schema.optional(Schema.Boolean),
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
  imageId: Schema.optional(Schema.String),
});
export type KakaoOptionRequest = Schema.Schema.Type<
  typeof kakaoOptionRequestSchema
>;
