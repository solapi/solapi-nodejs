import {z} from 'zod/v4';
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

export const kakaoAlimtalkTemplateQuickReplyWebLinkSchema = z.object({
  name: z.string(),
  linkType: z.literal('WL'),
  linkMo: z.string(),
  linkPc: z.string().optional(),
});

export const kakaoAlimtalkTemplateQuickReplyAppLinkSchema = z.object({
  name: z.string(),
  linkType: z.literal('AL'),
  linkAnd: z.string(),
  linkIos: z.string(),
});

export const kakaoAlimtalkTemplateQuickReplyDefaultSchema = z.object({
  name: z.string(),
  linkType: z.enum(['BK', 'BT', 'BC']),
});

export const kakaoAlimtalkTemplateQuickReplySchema = z.union([
  kakaoAlimtalkTemplateQuickReplyWebLinkSchema,
  kakaoAlimtalkTemplateQuickReplyAppLinkSchema,
  kakaoAlimtalkTemplateQuickReplyDefaultSchema,
]);

export type KakaoAlimtalkTemplateQuickReplySchema = z.infer<
  typeof kakaoAlimtalkTemplateQuickReplySchema
>;
