import z from 'zod/v4';
import {kakaoOptionRequest} from '../../requests/kakao/kakaoOptionRequest';
import {KakaoButton, kakaoButtonSchema} from './kakaoButton';

export const baseKakaoOptionSchema = z.object({
  pfId: z.string(),
  templateId: z.string().optional(),
  variables: z.record(z.string(), z.string()).optional(),
  disableSms: z.boolean().optional(),
  adFlag: z.boolean().optional(),
  imageId: z.string().optional(),
  buttons: z.array(kakaoButtonSchema).optional(),
});

export class KakaoOption {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: Array<KakaoButton>;
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
