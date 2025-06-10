import {
  KakaoAlimtalkTemplateAssignType,
  KakaoAlimtalkTemplateInterface,
} from '../../kakao/kakaoAlimtalkTemplate';

export interface GetKakaoTemplateResponse
  extends KakaoAlimtalkTemplateInterface {
  assignType: KakaoAlimtalkTemplateAssignType;
  accountId: string;
  commentable: boolean;
  dateCreated: string;
  dateUpdated: string;
}
