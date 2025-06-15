import {Schema} from 'effect';
import {KakaoButton, kakaoButtonSchema} from '../../base/kakao/kakaoButton';

export type kakaoOptionRequest = {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: ReadonlyArray<KakaoButton>;
  imageId?: string;
};

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
