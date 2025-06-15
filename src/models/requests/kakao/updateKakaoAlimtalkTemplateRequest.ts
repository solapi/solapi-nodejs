import {
  KakaoAlimtalkTemplateEmphasizeType,
  KakaoAlimtalkTemplateHighlightType,
  KakaoAlimtalkTemplateItemType,
  KakaoAlimtalkTemplateMessageType,
} from '../../base/kakao/kakaoAlimtalkTemplate';
import {KakaoAlimtalkTemplateQuickReply} from '../../base/kakao/kakaoAlimtalkTemplateQuickReply';
import {KakaoButton} from '../../base/kakao/kakaoButton';

/**
 * @description 카카오 알림톡 템플릿 요청 타입
 */
export type UpdateKakaoAlimtalkTemplateRequest = {
  /**
   * @description 알림톡 템플릿 제목
   */
  name?: string;

  /**
   * @description 알림톡 템플릿 내용
   */
  content?: string;

  /**
   * @description 알림톡 템플릿 카테고리 코드, KakaoAlimtalkTemplateCategory 타입 참고
   */
  categoryCode?: string;

  /**
   * @description 알림톡 템플릿 버튼 배열
   */
  buttons?: Array<KakaoButton>;

  /**
   * @description 바로연결(버튼과 유사한 링크) 배열
   */
  quickReplies?: Array<KakaoAlimtalkTemplateQuickReply>;

  /**
   * @description 알림톡 템플릿 메시지 유형
   */
  messageType?: KakaoAlimtalkTemplateMessageType;

  /**
   * @description 카카오 알림톡 템플릿 강조 유형
   */
  emphasizeType?: KakaoAlimtalkTemplateEmphasizeType;

  /**
   * @description 아이템 리스트 용 헤더
   */
  header?: string;

  /**
   * @description 아이템 리스트용 하이라이트 정보 유형
   */
  highlight?: KakaoAlimtalkTemplateHighlightType;

  /**
   * @description 아이템 리스트 유형
   */
  item?: KakaoAlimtalkTemplateItemType;

  /**
   * @description 부가정보, 치환문구를 넣을 수 없음
   */
  extra?: string;

  /**
   * @description 강조 표기 제목 (강조 표기형 유형만 등록 가능)
   */
  emphasizeTitle?: string;

  /**
   * @description 강조 표기 부제목 (강조 표기형 유형만 등록 가능)
   */
  emphasizeSubTitle?: string;

  /**
   * @description 보안 템플릿 여부
   */
  securityFlag?: boolean;

  /**
   * @description 알림톡 템플릿 내에 업로드 할 이미지 ID (Storage API 사용 필요)
   */
  imageId?: string;
};
