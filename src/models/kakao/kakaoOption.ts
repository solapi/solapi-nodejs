import {KakaoButton} from './kakaoButton';

export type kakaoOptionRequest = {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: Array<KakaoButton>;
  imageId?: string;
};

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
