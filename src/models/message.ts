import {KakaoOption, kakaoOptionRequest} from './kakao/kakaoOption';

/**
 * @name MessageType 메시지 유형(단문 문자, 장문 문자, 알림톡 등)
 * SMS: 단문 문자
 * LMS: 장문 문자
 * MMS: 사진 문자
 * ATA: 알림톡
 * CTA: 친구톡
 * CTI: 사진 한장이 포함된 친구톡
 * RCS_SMS: RCS 단문 문자
 * RCS_LMS: RCS 장문 문자
 * RCS_MMS: RCS 사진 문자
 * RCS_TPL: RCS 템플릿
 * NSA: 네이버 스마트알림(톡톡)
 */
export type MessageType =
  | 'SMS'
  | 'LMS'
  | 'MMS'
  | 'ATA'
  | 'CTA'
  | 'CTI'
  | 'RCS_SMS'
  | 'RCS_LMS'
  | 'RCS_MMS'
  | 'RCS_TPL'
  | 'NSA';

export type MessageParameter = {
  to: string | Array<string>;
  from?: string;
  text?: string;
  imageId?: string;
  type?: MessageType;
  subject?: string;
  autoTypeDetect?: boolean;
  kakaoOptions?: kakaoOptionRequest;
  country?: string;
  customFields?: Record<string, string>;
  replacements?: Array<object>;
};

/**
 * 메시지 모델, 전체적인 메시지 발송을 위한 파라미터는 이 Message 모델에서 관장함
 */
export class Message {
  /**
   * 수신번호
   */
  to: string | Array<string>;

  /**
   * 발신번호
   */
  from?: string;

  /**
   * 메시지 내용
   */
  text?: string;

  /**
   * 메시지 생성일자
   */
  dateCreated?: string;

  /**
   * 메시지 수정일자
   */
  dateUpdated?: string;

  /**
   * 메시지의 그룹 ID
   */
  groupId?: string;

  /**
   * 해당 메시지의 ID
   */
  messageId?: string;

  /**
   * MMS 전용 스토리지(이미지) ID
   */
  imageId?: string;

  /**
   * @name MessageType 메시지 유형
   */
  type?: MessageType;

  /**
   * 문자 제목(LMS, MMS 전용)
   */
  subject?: string;

  /**
   * 메시지 타입 감지 여부(비활성화 시 반드시 타입이 명시 되어야 함)
   */
  autoTypeDetect?: boolean;

  /**
   * 카카오 알림톡/친구톡을 위한 프로퍼티
   */
  kakaoOptions?: KakaoOption;

  /**
   * 해외 문자 발송을 위한 국가번호(예) "82", "1" 등)
   */
  country?: string;

  /**
   * 메시지 로그
   */
  log?: Array<object>;
  replacements?: Array<object>;

  /**
   * 메시지 상태 코드
   * @see https://developers.solapi.com/references/message-status-codes
   */
  statusCode?: string;

  /**
   * 사용자를 위한 사용자만의 커스텀 값을 입력할 수 있는 필드
   * 단, 오브젝트 내 키 값 모두 문자열 형태로 입력되어야 합니다.
   */
  customFields?: Record<string, string>;

  constructor(parameter: MessageParameter) {
    this.to = parameter.to;
    this.from = parameter.from;
    this.text = parameter.text;
    this.imageId = parameter.imageId;
    this.type = parameter.type;
    this.subject = parameter.subject;
    this.autoTypeDetect = parameter.autoTypeDetect;
    this.country = parameter.country;
    if (parameter.kakaoOptions != undefined) {
      this.kakaoOptions = new KakaoOption(parameter.kakaoOptions);
    }
    this.customFields = parameter.customFields;
    this.replacements = parameter.replacements;
  }
}
