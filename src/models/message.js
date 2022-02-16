"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    /**
     * 단문문자 (80 byte 미만)
     * */
    MessageType[MessageType["SMS"] = 0] = "SMS";
    /**
     * 장문문자 (80 byte 이상, 2,000 byte 미만)
     */
    MessageType[MessageType["LMS"] = 1] = "LMS";
    /**
     * 이미지가 포함된 문자 (80 byte 이상, 2,000 byte 미만), 200kb 이내 이미지 파일 1장 업로드 가능
     */
    MessageType[MessageType["MMS"] = 2] = "MMS";
    /**
     * 카카오 알림톡
     * */
    MessageType[MessageType["ATA"] = 3] = "ATA";
    /**
     * 카카오 친구톡
     */
    MessageType[MessageType["CTA"] = 4] = "CTA";
    /**
     * 이미지가 포함된 카카오 친구톡(이미지 1장 업로드 가능)
     */
    MessageType[MessageType["CTI"] = 5] = "CTI";
    /**
     * RCS 단문문자
     */
    MessageType[MessageType["RCS_SMS"] = 6] = "RCS_SMS";
    /**
     * RCS 장문문자
     */
    MessageType[MessageType["RCS_LMS"] = 7] = "RCS_LMS";
    /**
     * 이미지가 포함된 RCS 문자
     */
    MessageType[MessageType["RCS_MMS"] = 8] = "RCS_MMS";
    /**
     * RCS 템플릿
     */
    MessageType[MessageType["RCS_TPL"] = 9] = "RCS_TPL";
    /**
     * 네이버 스마트 알림(네이버 톡톡)
     */
    MessageType[MessageType["NSA"] = 10] = "NSA";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
class Message {
    constructor() {
        this.autoTypeDetect = true;
    }
}
exports.default = Message;
