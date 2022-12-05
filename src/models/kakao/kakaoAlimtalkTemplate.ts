import {KakaoButton, KakaoButtonType} from './kakaoButton';
import stringDateTransfer from '../../lib/stringDateTrasnfer';
import {GetKakaoTemplateResponse} from '../../responses/kakao/getKakaoTemplateResponse';
import {KakaoChannelCategory} from './kakaoChannel';

/**
 * @description 카카오 채널 카테고리 타입
 * @property code 카테고리 코드번호
 * @property name 카테고리 설명(이름)
 */
export type KakaoAlimtalkTemplateCategory = KakaoChannelCategory;

/**
 * @description 카카오 알림톡 템플릿 메시지 유형<br>
 * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
 */
export type KakaoAlimtalkTemplateMessageType = 'BA' | 'EX' | 'AD' | 'MI';

/**
 * @description 카카오 알림톡 템플릿 강조 유형<br>
 * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형
 */
export type KakaoAlimtalkTemplateEmphasizeType = 'NONE' | 'TEXT' | 'IMAGE';

/**
 * @description 카카오 알림톡 템플릿 그룹 유형(기본값은 Channel)
 */
export type KakaoAlimtalkTemplateAssignType = 'CHANNEL' | 'GROUP';

/**
 * @description 카카오 알림톡 템플릿 상태<br><br>
 * PENDING - 대기<br><br>
 * INSPECTING - 검수중<br><br>
 * APPROVED - 등록완료(검수완료)<br><br>
 * REJECTED - 반려됨<br><br>
 * DELETED - 삭제됨
 */
export type KakaoAlimtalkTemplateStatus =
  | 'PENDING'
  | 'INSPECTING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DELETED';

/**
 * @description 알림톡 템플릿 댓글 타입, 현재 kakao v2 API에는 사용되지 않음
 */
export type KakaoAlimtalkTemplateCommentType = {
  isAdmin: boolean;
  memberId: string;
  content: string;
  dateCreated: string;
};

/**
 * @deprecated kakao v2 api에서는 더이상 사용되지 않습니다.
 */
export type KakaoAlimtalkTemplateCodeType = {
  status: Omit<KakaoAlimtalkTemplateStatus, 'DELETED'>;
  comments: Array<KakaoAlimtalkTemplateCommentType>;
};

export type KakaoAlimtalkTemplateQuickReplyType = {
  name: string;
  linkType: Omit<KakaoButtonType, 'AC' | 'DS'>;
  linkMo?: string | null;
  linkPc?: string | null;
  linkAnd?: string | null;
  linkIos?: string | null;
};

export type KakaoAlimtalkTemplateHighlightType = {
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
};

export type KakaoAlimtalkTemplateItemType = {
  list: Array<{
    title: string;
    description: string;
  }>;
  summary: {
    title?: string | null;
    description?: string | null;
  };
};

export interface KakaoAlimtalkTemplateInterface {
  /**
   * 템플릿 제목
   */
  name: string;

  /**
   * 카카오 비즈니스 채널 ID
   */
  channelId?: string | null;

  /**
   * 카카오 비즈니스 채널 그룹 ID
   */
  channelGroupId?: string | null;

  /**
   * 알림톡 템플릿 내용
   */
  content?: string;

  /**
   * 알림톡 템플릿 숨김 여부
   */
  isHidden?: boolean;

  /**
   * 알림톡 템플릿 메시지 유형
   */
  messageType: KakaoAlimtalkTemplateMessageType;

  /**
   * 강조 유형
   */
  emphasizeType: KakaoAlimtalkTemplateEmphasizeType;

  /**
   * 부가정보
   * 메시지 유형이 "부가정보형"또는 "복합형"일 경우 필수
   */
  extra?: string | null;

  /**
   * 간단 광고 문구
   * 메시지 유형이 "광고추가형"또는 "복합형"일 경우 필수
   */
  ad?: string | null;

  /**
   * 강조표기 핵심문구 (변수사용가능, emphasizeType이 TEXT일 경우 필수 값)
   * 템플릿 내용에 강조표기할 핵심문구가 동일하게 포함되어 있어야합니다.
   */
  emphasizeTitle?: string | null;

  /**
   * 강조표기 보조문구(emphasizeType이 TEXT일 경우 필수 값)
   * 템플릿 내용에 강조표기할 보조문구가 동일하게 포함되어 있어야합니다.
   */
  emphasizeSubtitle?: string | null;

  /**
   * PC 노출 여부
   * OTP, 보안 메시지의 경우 유저선택 무관 PC 미노출
   */
  securityFlag: boolean;

  /**
   * 템플릿에 사용되는 이미지 ID
   */
  imageId?: string | null;

  /**
   * 카카오 알림톡 템플릿 그룹 유형
   */
  assignType?: KakaoAlimtalkTemplateAssignType;

  /**
   * 카카오 알림톡 템플릿 버튼 목록
   */
  buttons: Array<KakaoButton>;

  /**
   * 카카오 알림톡 템플릿 상태 현황목록
   */
  comments?: Array<Omit<KakaoAlimtalkTemplateCodeType, 'status'>>;

  /**
   * 바로가기 연결(링크) 목록
   */
  quickReplies?: Array<KakaoAlimtalkTemplateQuickReplyType>;

  header?: string | null;

  highlight?: KakaoAlimtalkTemplateHighlightType;

  item?: KakaoAlimtalkTemplateItemType;

  /**
   * 카카오 알림톡 템플릿 ID
   */
  templateId: string;
}

/**
 * @description 카카오 알림톡 템플릿 모델<br>
 * 알림톡 템플릿 자체의 정보는 아래 페이지를 참고해보세요!
 * @see https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide
 */
export class KakaoAlimtalkTemplate implements KakaoAlimtalkTemplateInterface {
  name: string;
  channelId?: string | null;
  channelGroupId?: string | null;
  content?: string;
  isHidden?: boolean;
  messageType: KakaoAlimtalkTemplateMessageType;
  emphasizeType: KakaoAlimtalkTemplateEmphasizeType;
  extra?: string | null;
  ad?: string | null;
  emphasizeTitle?: string | null;
  emphasizeSubtitle?: string | null;
  securityFlag: boolean;
  imageId?: string | null;
  assignType?: KakaoAlimtalkTemplateAssignType;
  buttons: KakaoButton[];
  quickReplies?: KakaoAlimtalkTemplateQuickReplyType[];
  header?: string | null;
  highlight?: KakaoAlimtalkTemplateHighlightType;
  item?: KakaoAlimtalkTemplateItemType;
  templateId: string;

  /**
   * 알림톡 템플릿 생성일자
   */
  dateCreated: Date;

  /**
   * 알림톡 템플릿 수정일자
   */
  dateUpdated: Date;

  constructor(
    parameter: KakaoAlimtalkTemplateInterface | GetKakaoTemplateResponse,
  ) {
    this.channelId = parameter.channelId;
    this.channelGroupId = parameter.channelGroupId;
    this.name = parameter.name;
    this.content = parameter.content;
    this.ad = parameter.ad;
    this.assignType = parameter.assignType;
    this.buttons = parameter.buttons;
    this.templateId = parameter.templateId;
    this.header = parameter.header;
    this.item = parameter.item;
    this.highlight = parameter.highlight;
    this.securityFlag = parameter.securityFlag;
    this.isHidden = parameter.isHidden;
    this.messageType = parameter.messageType;
    this.emphasizeType = parameter.emphasizeType;
    this.extra = parameter.extra;
    this.emphasizeTitle = parameter.emphasizeTitle;
    this.emphasizeSubtitle = parameter.emphasizeSubtitle;
    this.imageId = parameter.imageId;
    this.quickReplies = parameter.quickReplies;

    if ('dateCreated' in parameter) {
      this.dateCreated = stringDateTransfer(parameter.dateCreated);
    }
    if ('dateUpdated' in parameter) {
      this.dateUpdated = stringDateTransfer(parameter.dateUpdated);
    }
  }
}
