import {Schema} from 'effect';

/**
 * @name "카카오 버튼타입"
 */
export type KakaoButtonType =
  | 'WL'
  | 'AL'
  | 'BK'
  | 'MD'
  | 'DS'
  | 'BC'
  | 'BT'
  | 'AC';

export type KakaoWebButton = {
  buttonName: string;
  buttonType: Extract<KakaoButtonType, 'WL'>;
  linkMo: string;
  linkPc?: string;
  linkAnd?: never;
  linkIos?: never;
};

export type KakaoAppButton = {
  buttonName: string;
  buttonType: Extract<KakaoButtonType, 'AL'>;
  linkMo?: never;
  linkPc?: never;
  linkAnd: string;
  linkIos: string;
};

export type KakaoDefaultButton = {
  buttonName: string;
  buttonType: Exclude<KakaoButtonType, 'WL' | 'AL'>;
  linkMo?: never;
  linkPc?: never;
  linkAnd?: never;
  linkIos?: never;
};

export type KakaoButton = KakaoWebButton | KakaoAppButton | KakaoDefaultButton;

export const kakaoWebButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('WL'),
  linkMo: Schema.String,
  linkPc: Schema.optional(Schema.NullOr(Schema.String)),
});

export const kakaoAppButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('AL'),
  linkAnd: Schema.String,
  linkIos: Schema.String,
});

export const kakaoDefaultButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('BK', 'MD', 'DS', 'BC', 'BT', 'AC'),
});

export const kakaoButtonSchema = Schema.Union(
  kakaoWebButtonSchema,
  kakaoAppButtonSchema,
  kakaoDefaultButtonSchema,
);

export type KakaoButtonSchema = Schema.Schema.Type<typeof kakaoButtonSchema>;
