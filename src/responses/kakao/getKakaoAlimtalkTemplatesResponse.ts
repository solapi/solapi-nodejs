import {GetKakaoTemplateResponse} from './getKakaoTemplateResponse';
import {KakaoAlimtalkTemplate} from '../../models/kakao/kakaoAlimtalkTemplate';

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
