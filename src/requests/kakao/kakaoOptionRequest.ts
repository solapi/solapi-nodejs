import {KakaoButton} from '../../models/kakao/kakaoButton';

export type kakaoOptionRequest = {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: Array<KakaoButton>;
  imageId?: string;
};
