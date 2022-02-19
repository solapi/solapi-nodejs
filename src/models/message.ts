import KakaoOption from './kakaoOption';

export enum MessageType {
    /**
     * 단문문자 (80 byte 미만)
     * */
    SMS,

    /**
     * 장문문자 (80 byte 이상, 2,000 byte 미만)
     */
    LMS,

    /**
     * 이미지가 포함된 문자 (80 byte 이상, 2,000 byte 미만), 200kb 이내 이미지 파일 1장 업로드 가능
     */
    MMS,

    /**
     * 카카오 알림톡
     * */
    ATA,

    /**
     * 카카오 친구톡
     */
    CTA,

    /**
     * 이미지가 포함된 카카오 친구톡(이미지 1장 업로드 가능)
     */
    CTI,

    /**
     * RCS 단문문자
     */
    RCS_SMS,

    /**
     * RCS 장문문자
     */
    RCS_LMS,

    /**
     * 이미지가 포함된 RCS 문자
     */
    RCS_MMS,

    /**
     * RCS 템플릿
     */
    RCS_TPL,

    /**
     * 네이버 스마트 알림(네이버 톡톡)
     */
    NSA
}

export default class Message {
    to: string;
    from: string;
    text?: string;
    dateCreated?: Date;
    dateUpdated?: Date;
    groupId?: string;
    messageId?: string;
    imageId?: string;
    type?: MessageType;
    subject?: string;
    autoTypeDetect = true;
    kakaoOptions?: KakaoOption;

    constructor(to: string, from: string, text: string, dateCreated: Date, dateUpdated: Date, groupId: string, messageId: string, imageId: string, type: MessageType, subject: string, autoTypeDetect: boolean, kakaoOptions: KakaoOption) {
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
    }
}
