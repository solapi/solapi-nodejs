import {Schema} from 'effect';
import {KakaoButtonType} from './kakaoButton';

export type KakaoAlimtalkTemplateQuickReplyWebLink = {
  name: string;
  linkType: Extract<KakaoButtonType, 'WL'>;
  linkMo: string;
  linkPc?: string;
  linkAnd?: never;
  linkIos?: never;
};

export type KakaoAlimtalkTemplateQuickReplyAppLink = {
  name: string;
  linkType: Extract<KakaoButtonType, 'AL'>;
  linkMo?: never;
  linkPc?: never;
  linkAnd: string;
  linkIos: string;
};

export type KakaoAlimtalkTemplateQuickReplyDefault = {
  name: string;
  linkType: Exclude<KakaoButtonType, 'AC' | 'DS' | 'MD' | 'AL' | 'WL'>;
  linkMo?: never;
  linkPc?: never;
  linkAnd?: never;
  linkIos?: never;
};

export type KakaoAlimtalkTemplateQuickReply =
  | KakaoAlimtalkTemplateQuickReplyWebLink
  | KakaoAlimtalkTemplateQuickReplyAppLink
  | KakaoAlimtalkTemplateQuickReplyDefault;

export const kakaoAlimtalkTemplateQuickReplyWebLinkSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('WL'),
  linkMo: Schema.String,
  linkPc: Schema.optional(Schema.String),
});

export const kakaoAlimtalkTemplateQuickReplyAppLinkSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('AL'),
  linkAnd: Schema.String,
  linkIos: Schema.String,
});

export const kakaoAlimtalkTemplateQuickReplyDefaultSchema = Schema.Struct({
  name: Schema.String,
  linkType: Schema.Literal('BK', 'BT', 'BC'),
});

export const kakaoAlimtalkTemplateQuickReplySchema = Schema.Union(
  kakaoAlimtalkTemplateQuickReplyWebLinkSchema,
  kakaoAlimtalkTemplateQuickReplyAppLinkSchema,
  kakaoAlimtalkTemplateQuickReplyDefaultSchema,
);

export type KakaoAlimtalkTemplateQuickReplySchema = Schema.Schema.Type<
  typeof kakaoAlimtalkTemplateQuickReplySchema
>;
