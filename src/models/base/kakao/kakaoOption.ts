import {Schema} from 'effect';
import {kakaoOptionRequest} from '../../requests/kakao/kakaoOptionRequest';
import {KakaoButton, kakaoButtonSchema} from './kakaoButton';

export const baseKakaoOptionSchema = Schema.Struct({
  pfId: Schema.String,
  templateId: Schema.optional(Schema.String),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}).pipe(
      Schema.transform(
        Schema.Record({key: Schema.String, value: Schema.String}),
        {
          decode: fromA => {
            const VARIABLE_KEY_PATTERN = /^#\{.+}$/;
            return Object.fromEntries(
              Object.entries(fromA).map(([key, value]) => [
                VARIABLE_KEY_PATTERN.test(key) ? key : `#{${key}}`,
                value,
              ]),
            );
          },
          encode: toI => toI,
        },
      ),
    ),
  ),
  disableSms: Schema.optional(Schema.Boolean),
  adFlag: Schema.optional(Schema.Boolean),
  imageId: Schema.optional(Schema.String),
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
});

export class KakaoOption {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: ReadonlyArray<KakaoButton>;
  imageId?: string;

  constructor(parameter: kakaoOptionRequest) {
    this.pfId = parameter.pfId;
    this.templateId = parameter.templateId;
    this.variables = parameter.variables;
    this.disableSms = parameter.disableSms;
    this.adFlag = parameter.adFlag;
    this.buttons = parameter.buttons;
    this.imageId = parameter.imageId;
  }
}
