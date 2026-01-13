import {
  baseKakaoOptionSchema,
  KakaoOption,
} from '@models/base/kakao/kakaoOption';
import {naverOptionSchema} from '@models/base/naver/naverOption';
import {RcsOption, rcsOptionSchema} from '@models/base/rcs/rcsOption';
import {FileIds} from '@models/requests/messages/groupMessageRequest';
import {Schema} from 'effect';
import {
  VoiceOptionSchema,
  voiceOptionSchema,
} from '@/models/requests/voice/voiceOption';

/**
 * @name MessageType 메시지 유형(단문 문자, 장문 문자, 알림톡 등)
 * SMS: 단문 문자
 * LMS: 장문 문자
 * MMS: 사진 문자
 * ATA: 알림톡
 * CTA: 친구톡
 * CTI: 사진 한장이 포함된 친구톡
 * NSA: 네이버 스마트알림(톡톡)
 * RCS_SMS: RCS 단문 문자
 * RCS_LMS: RCS 장문 문자
 * RCS_MMS: RCS 사진 문자
 * RCS_TPL: RCS 템플릿
 * RCS_ITPL: RCS 이미지 템플릿
 * RCS_LTPL: RCS LMS 템플릿 문자
 * FAX: 팩스
 * VOICE: 음성문자(TTS)
 */
export type MessageType =
  | 'SMS'
  | 'LMS'
  | 'MMS'
  | 'ATA'
  | 'CTA'
  | 'CTI'
  | 'NSA'
  | 'RCS_SMS'
  | 'RCS_LMS'
  | 'RCS_MMS'
  | 'RCS_TPL'
  | 'RCS_ITPL'
  | 'RCS_LTPL'
  | 'FAX'
  | 'VOICE'
  | 'BMS_TEXT'
  | 'BMS_IMAGE'
  | 'BMS_WIDE'
  | 'BMS_WIDE_ITEM_LIST'
  | 'BMS_CAROUSEL_FEED'
  | 'BMS_PREMIUM_VIDEO'
  | 'BMS_COMMERCE'
  | 'BMS_CAROUSEL_COMMERCE'
  | 'BMS_FREE';

/**
 * 	메시지 타입
SMS: 단문 문자
LMS: 장문 문자
MMS: 사진 문자
ATA: 알림톡
CTA: 친구톡
CTI: 친구톡 + 이미지
NSA: 네이버 스마트 알림
RCS_SMS: RCS 단문 문자
RCS_LMS: RCS 장문 문자
RCS_MMS: RCS 사진 문자
RCS_TPL: RCS 템플릿 문자
RCS_ITPL: RCS 이미지 템플릿 문자
RCS_LTPL: RCS LMS 템플릿 문자
FAX: 팩스
VOICE: 보이스콜
BMS_TEXT: 브랜드 메시지 텍스트형
BMS_IMAGE: 브랜드 메시지 이미지형
BMS_WIDE: 브랜드 메시지 와이드형
BMS_WIDE_ITEM_LIST: 브랜드 메시지 와이드 아이템 리스트형
BMS_CAROUSEL_FEED: 브랜드 메시지 캐러셀 피드형
BMS_PREMIUM_VIDEO: 브랜드 메시지 프리미엄 비디오형
BMS_COMMERCE: 브랜드 메시지 커머스형
BMS_CAROUSEL_COMMERCE: 브랜드 메시지 캐러셀 커머스형
 */
export const messageTypeSchema = Schema.Literal(
  'SMS',
  'LMS',
  'MMS',
  'ATA',
  'CTA',
  'CTI',
  'NSA',
  'RCS_SMS',
  'RCS_LMS',
  'RCS_MMS',
  'RCS_TPL',
  'RCS_ITPL',
  'RCS_LTPL',
  'FAX',
  'VOICE',
  'BMS_TEXT',
  'BMS_IMAGE',
  'BMS_WIDE',
  'BMS_WIDE_ITEM_LIST',
  'BMS_CAROUSEL_FEED',
  'BMS_PREMIUM_VIDEO',
  'BMS_COMMERCE',
  'BMS_CAROUSEL_COMMERCE',
  'BMS_FREE',
);

export const messageSchema = Schema.Struct({
  to: Schema.Union(Schema.String, Schema.Array(Schema.String)),
  from: Schema.optional(Schema.String),
  text: Schema.optional(Schema.String),
  imageId: Schema.optional(Schema.String),
  type: Schema.optional(messageTypeSchema),
  subject: Schema.optional(Schema.String),
  autoTypeDetect: Schema.optional(Schema.Boolean),
  kakaoOptions: Schema.optional(baseKakaoOptionSchema),
  rcsOptions: Schema.optional(rcsOptionSchema),
  country: Schema.optional(Schema.String),
  replacements: Schema.optional(Schema.Array(Schema.Struct({}))),
  customFields: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  naverOptions: Schema.optional(naverOptionSchema),
  faxOptions: Schema.optional(
    Schema.Struct({fileIds: Schema.Array(Schema.String)}),
  ),
  voiceOptions: Schema.optional(voiceOptionSchema),
});

export type MessageSchema = Schema.Schema.Type<typeof messageSchema>;

/**
 * 메시지 모델, 전체적인 메시지 발송을 위한 파라미터는 이 Message 모델에서 관장함
 */
export class Message {
  /**
   * 수신번호
   */
  to: string | ReadonlyArray<string>;

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
   * RCS 메시지를 위한 프로퍼티
   */
  rcsOptions?: RcsOption;

  /**
   * 해외 문자 발송을 위한 국가번호(예) "82", "1" 등)
   */
  country?: string;

  /**
   * 메시지 로그
   */
  log?: ReadonlyArray<object>;
  replacements?: ReadonlyArray<object>;

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

  faxOptions?: FileIds;

  voiceOptions?: VoiceOptionSchema;

  constructor(parameter: MessageSchema) {
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
    if (parameter.rcsOptions != undefined) {
      this.rcsOptions = new RcsOption(parameter.rcsOptions);
    }
    this.customFields = parameter.customFields;
    this.replacements = parameter.replacements;
    this.faxOptions = parameter.faxOptions;
    this.voiceOptions = parameter.voiceOptions;
  }
}
