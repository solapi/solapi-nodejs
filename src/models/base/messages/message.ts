import {z} from 'zod/v4';
import {FileIds} from '../../requests/messages/groupMessageRequest';
import {KakaoOption, baseKakaoOptionSchema} from '../kakao/kakaoOption';
import {naverOptionSchema} from '../naver/naverOption';
import {RcsOption, rcsOptionSchema} from '../rcs/rcsOption';

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
  | 'VOICE';

export const messageTypeSchema = z.enum([
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
]);

export const messageSchema = z
  .object({
    to: z.union([z.string(), z.array(z.string())]).describe('수신번호'),
    from: z.string().optional().describe('발신번호'),
    text: z.string().optional().describe('메시지 내용'),
    imageId: z.string().optional().describe('MMS 전용 스토리지(이미지) ID'),
    type: messageTypeSchema.optional().describe('메시지 유형'),
    subject: z.string().optional().describe('문자 제목(LMS, MMS 전용)'),
    autoTypeDetect: z
      .boolean()
      .optional()
      .default(true)
      .describe('메시지 타입 감지 여부'),
    kakaoOptions: baseKakaoOptionSchema
      .optional()
      .describe('카카오 알림톡/친구톡을 위한 프로퍼티'),
    rcsOptions: rcsOptionSchema
      .optional()
      .describe('RCS 메시지를 위한 프로퍼티'),
    country: z.string().optional().describe('해외 문자 발송을 위한 국가번호'),
    replacements: z.array(z.object({})).optional(),
    customFields: z
      .record(z.string(), z.string())
      .optional()
      .describe('사용자 커스텀 필드'),
    faxOptions: z
      .object({
        fileIds: z.array(z.string()),
      })
      .optional(),
    naverOptions: z
      .object({...naverOptionSchema})
      .optional()
      .describe('네이버 톡톡 발송을 위한 프로퍼티'),
  })
  // 모든 필드는 명시적으로 정의된 항목만 허용
  .strict();

export type MessageSchema = z.infer<typeof messageSchema>;

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

  faxOptions?: FileIds;

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
  }
}
