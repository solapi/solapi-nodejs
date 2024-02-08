import {RcsButton} from './rcsButton';
export type AdditionalBody = {
  title: string;
  description: string;
  imaggeId?: string;
  buttons?: Array<RcsButton>;
}

export type RcsOptionRequest = {
  brandId: string;
  templateId?: string;
  copyAllowed?: boolean;
  mmsType?: 'M3' | 'S3' | 'M4' | 'S4' | 'M5' | 'S5' | 'M6' | 'S6'; // (M: 중간 사이즈. S: 작은 사이즈. 숫자: 사진 개수)
  commercialType?: boolean;
  variables?: Record<string, string>;
  disableSms?: boolean;
  additionalBody?: AdditionalBody;
  buttons: Array<RcsButton>;
};

export class RcsOption {
  brandId: string;
  templateId?: string;
  copyAllowed?: boolean;
  mmsType?: 'M3' | 'S3' | 'M4' | 'S4' | 'M5' | 'S5' | 'M6' | 'S6'; // (M: 중간 사이즈. S: 작은 사이즈. 숫자: 사진 개수)
  commercialType?: boolean;
  variables?: Record<string, string>;
  disableSms?: boolean;
  additionalBody?: AdditionalBody;
  buttons: Array<RcsButton>;

  constructor(parameter: RcsOptionRequest) {
    this.brandId = parameter.brandId;
    this.templateId = parameter.templateId;
    this.copyAllowed = parameter.copyAllowed;
    this.mmsType = parameter.mmsType;
    this.commercialType = parameter.commercialType;
    this.variables = parameter.variables;
    this.disableSms = parameter.disableSms;
    this.additionalBody = parameter.additionalBody;
    this.buttons = parameter.buttons;
  }
}
