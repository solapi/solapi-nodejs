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
