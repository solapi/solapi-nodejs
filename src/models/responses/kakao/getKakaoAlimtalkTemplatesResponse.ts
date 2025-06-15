import {KakaoAlimtalkTemplate} from '../../base/kakao/kakaoAlimtalkTemplate';
import {GetKakaoTemplateResponse} from './getKakaoTemplateResponse';

export interface GetKakaoAlimtalkTemplatesResponse {
  limit: number;
  templateList: Array<GetKakaoTemplateResponse>;
  startKey: string;
  nextKey: string | null;
}

export interface GetKakaoAlimtalkTemplatesFinalizeResponse {
  limit: number;
  templateList: Array<KakaoAlimtalkTemplate>;
  startKey: string;
  nextKey: string | null;
}
