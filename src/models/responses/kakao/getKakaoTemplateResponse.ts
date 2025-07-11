import {
  KakaoAlimtalkTemplateAssignType,
  KakaoAlimtalkTemplateInterface,
} from '../../base/kakao/kakaoAlimtalkTemplate';

export interface GetKakaoTemplateResponse
  extends KakaoAlimtalkTemplateInterface {
  assignType: KakaoAlimtalkTemplateAssignType;
  accountId: string;
  commentable: boolean;
  dateCreated: string;
  dateUpdated: string;
}
