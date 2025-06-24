import {
  KakaoAlimtalkTemplateAssignType,
  KakaoAlimtalkTemplateInterface,
} from '../../models/kakao/kakaoAlimtalkTemplate';

export interface GetKakaoTemplateResponse
  extends KakaoAlimtalkTemplateInterface {
  assignType: KakaoAlimtalkTemplateAssignType;
  accountId: string;
  commentable: boolean;
  dateCreated: string;
  dateUpdated: string;
  variables: Array<{
    name: string;
  }>;
}
