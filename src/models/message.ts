import KakaoOption from './kakaoOption';

/**
 * 메시지 유형(단문 문자, 장문 문자, 알림톡 등)
 */
export enum MessageType {
    /**
     * 단문문자 (80 byte 미만)
     * */
    SMS = 'SMS',

    /**
     * 장문문자 (80 byte 이상, 2,000 byte 미만)
     */
    LMS = 'LMS',

    /**
     * 이미지가 포함된 문자 (80 byte 이상, 2,000 byte 미만), 200kb 이내 이미지 파일 1장 업로드 가능
     */
    MMS = 'MMS',

    /**
     * 카카오 알림톡
     * */
    ATA = 'ATA',

    /**
     * 카카오 친구톡
     */
    CTA = 'CTA',

    /**
     * 이미지가 포함된 카카오 친구톡(이미지 1장 업로드 가능)
     */
    CTI = 'CTI',

    /**
     * RCS 단문문자
     */
    RCS_SMS = 'RCS_SMS',

    /**
     * RCS 장문문자
     */
    RCS_LMS = 'RCS_LMS',

    /**
     * 이미지가 포함된 RCS 문자
     */
    RCS_MMS = 'RCS_MMS',

    /**
     * RCS 템플릿
     */
    RCS_TPL = 'RCS_TPL',

    /**
     * 네이버 스마트 알림(네이버 톡톡)
     */
    NSA = 'NSA'
}

/**
 * 메시지 모델
 */
export default class Message {
    /**
     * 수신번호
     */
    to: string;

    /**
     * 발신번호
     */
    from: string;

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
     * 메시지 유형
     */
    type: MessageType;

    /**
     * 문자 제목(LMS, MMS 전용)
     */
    subject?: string;

    /**
     * 메시지 타입 감지 여부(비활성화 시 반드시 타입이 명시 되어야 함)
     */
    autoTypeDetect = true;

    /**
     * 카카오 알림톡/친구톡을 위한 프로퍼티
     */
    kakaoOptions?: KakaoOption;

    /**
     * 해외 문자 발송을 위한 국가번호(예) "82", "1" 등)
     */
    country = '82';


    constructor(to: string, from: string, text: string, dateCreated: string, dateUpdated: string, groupId: string, messageId: string, imageId: string, type: MessageType, subject: string, autoTypeDetect: boolean, kakaoOptions: KakaoOption, country: string) {
        this.to = to;
        this.from = from;
        this.text = text;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.groupId = groupId;
        this.messageId = messageId;
        this.imageId = imageId;
        this.type = type;
        this.subject = subject;
        this.autoTypeDetect = autoTypeDetect;
        this.kakaoOptions = kakaoOptions;
        this.country = country;
    }
}
