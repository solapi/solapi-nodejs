import {Schema} from 'effect';

// 네이버 스마트 알림 naverOptions 버튼 스키마
const naverOptionButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.String,
  linkMo: Schema.optional(Schema.String),
  linkPc: Schema.optional(Schema.String),
  linkAnd: Schema.optional(Schema.String),
  linkIos: Schema.optional(Schema.String),
});

// naverOptions 최상위 스키마
export const naverOptionSchema = Schema.Struct({
  talkId: Schema.String,
  templateId: Schema.String,
  disableSms: Schema.optional(Schema.Boolean),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  buttons: Schema.optional(Schema.Array(naverOptionButtonSchema)),
});

export type NaverOptionSchema = Schema.Schema.Type<typeof naverOptionSchema>;
