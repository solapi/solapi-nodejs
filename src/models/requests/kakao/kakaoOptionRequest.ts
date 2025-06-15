import {z} from 'zod/v4';
import {KakaoButton, kakaoButtonSchema} from '../../base/kakao/kakaoButton';

export type kakaoOptionRequest = {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: Array<KakaoButton>;
  imageId?: string;
};

export const kakaoOptionRequestSchema = z.object({
  pfId: z.string(),
  templateId: z.string().optional(),
  variables: z.record(z.string(), z.string()).optional(),
  disableSms: z.boolean().optional(),
  adFlag: z.boolean().optional(),
  buttons: z.array(kakaoButtonSchema).optional(),
  imageId: z.string().optional(),
});
