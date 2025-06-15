import {z} from 'zod/v4';

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

export const kakaoWebButtonSchema = z.object({
  buttonName: z.string(),
  buttonType: z.literal('WL'),
  linkMo: z.string(),
  linkPc: z.string().optional(),
});

export const kakaoAppButtonSchema = z.object({
  buttonName: z.string(),
  buttonType: z.literal('AL'),
  linkAnd: z.string(),
  linkIos: z.string(),
});

export const kakaoDefaultButtonSchema = z.object({
  buttonName: z.string(),
  buttonType: z.enum(['BK', 'MD', 'DS', 'BC', 'BT', 'AC']),
});

export const kakaoButtonSchema = z.union([
  kakaoWebButtonSchema,
  kakaoAppButtonSchema,
  kakaoDefaultButtonSchema,
]);

export type KakaoButtonSchema = z.infer<typeof kakaoButtonSchema>;
