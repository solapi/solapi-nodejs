/**
 * SOLAPI SDK JS V4
 * TYPESCRIPT TYPINGS
 */

declare module 'solapi';


/*
 * RESPONSES
 */

/**
 * @deprecated
 * This should not be used.
 */
export type SolapiUnknownJSONResponse = object;

// TODO: create proper type
type StatusCode = string;

export interface SolapiCommonResponse {
    statusCode: StatusCode;
    statusMessage: string;
}

export interface SolapiErrorResponse extends SolapiCommonResponse {
    errorCount: number;
}

export interface SolapiPaginationResponse extends SolapiCommonResponse {
    nextKey: string;
    startKey: string;
    limit?: number;
}

export interface SolapiLog {
    message: string;
}



/*
 * MESSAGES
 */

export type MessageType = 'SMS' | 'LMS' | 'MMS' | 'CTA' | 'ATA';
export type Message = SMSMessage | MMSMessage | LMSMessage | KakaoAlimtalkMessage | KakaoChinguTalkMessage;

export interface MessageBase {
    to: string | string[];
    from: string;
    text: string;
    autoTypeDetect?: boolean;
}

export interface SMSMessage extends MessageBase {
    country?: string;
    type?: 'SMS';
}

export interface MMSMessage extends MessageBase {
    type?: 'MMS';
    subject?: string;
    imageId: string;
}

export interface LMSMessage extends MessageBase {
    type?: 'LMS';
    subject?: string;
}

export interface KakaoAlimtalkMessage extends MessageBase {
    type?: 'ATA';
    kakaoOptions: {
        pfId: string;
        buttons: KakaoButton[];
    };
}

export interface KakaoChinguTalkMessage extends MessageBase {
    type?: 'CTA';
    kakaoOptions: {
        pfId: string;
        buttons: KakaoButton[];
        imageId?: string;
    };
}



/*
 * MESSAGES - BUTTONS
 */

export type KakaoButton = KakaoWebLinkButton | KakaoAppLinkButton | KakaoBotKeywordButton | KakaoMDButton | KakaoAddChannelButton | KakaoBusinessChatButton | KakaoChatBotButton;
export type KakaoButtonType = 'WL' | 'AL' | 'BK' | 'MD' | 'AC' | 'BC' | 'BT';

export interface KakaoButtonBase {
    buttonType: KakaoButtonType;
    buttonName: string;
}

export interface KakaoWebLinkButton extends KakaoButtonBase {
    buttonType: 'WL';
    linkMo?: string;
    linkPc?: string;
}

export interface KakaoAppLinkButton extends KakaoButtonBase {
    buttonType: 'AL';
    linkAnd: string;
    linkIos: string;
}

export interface KakaoBotKeywordButton extends KakaoButtonBase {
    buttonType: 'BK';
}

export interface KakaoMDButton extends KakaoButtonBase {
    buttonType: 'MD';
}

export interface KakaoAddChannelButton extends KakaoButtonBase {
    buttonType: 'AC';
}

export interface KakaoBusinessChatButton extends KakaoButtonBase {
    buttonType: 'BC';
}

export interface KakaoChatBotButton extends KakaoButtonBase {
    buttonType: 'BT';
}



/*
 * MESSAGES - QUERY
 */

export interface MessageListQuery {
    startKey?: string;
    limit?: number;
    groupId?: string;
}



/*
 * DEPRECATED:
 * IMAGE
 * 
 * DEPRECATED SINCE: https://github.com/solapi/solapi-sdk-js-v4/commit/0f184fd4556bd17670d4638e439c6626090efcd9
 */

export type ImageData = unknown;

/**
 * @deprecated
 * Image API 는 Deprecated 되었습니다.
 * Storage API 를 대신 사용해 주십시오.
 */
export class Image {
    constructor(image: ImageData);
    
    createImage(): Promise<string>;
    getImageId(): string;
}



/*
* AGENT
*/

export interface Agent {
    osPlatform?: string;
    sdkVersion?: string;
}



/*
* HEADER TYPE
*/

// apiKey/apiSecret = 1, accessToken = 2
export type HeaderType = 1 | 2;



/*
* CONFIG
*/

export interface SolapiConfig {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    to: string;
    from: string;
    domain?: string;
    prefix?: string;
    protocol?: string;
}

export namespace config {
    function getAuth(headerType?: HeaderType): void;
    function getBaseUrl(): string;
    
    function getFrom(): string;
    function getTo(): string;
    
    function init(config: SolapiConfig): void;
    function getUrl(path: string): string;
}



/*
* GROUP
*/

export interface GroupConstructor {
    groupId?: string;
    agent?: any;
}

export interface GroupListResponse extends SolapiPaginationResponse {
    // TODO: write this properly.
    groupList: any;
}

// TODO: check if this interface is correct.
export interface GroupInfoResponse extends SolapiPaginationResponse {
    app: string;
    balance: number;
    countForCharge: number;
    customFields: any[];

    dateCompleted: string;
    dateSent: string;
    dateCreated: string;
    dateUpdated: string;
    flagUpdated: string;

    isRefunded: boolean;
    osPlatform: string;
    point: string;
    prepaid: any;

    apiVersion: string;
    sdkVersion: string;

    serviceMethod: any;
    strict: any;
    count: number;
    log: SolapiLog[];

    // TODO: please check this later.
    status: any;

    _id: string;
    groupId: string;
    hint: string;
    masterAccountId: string;
    accountId: string;

}

export interface GroupDeleteResponse extends SolapiPaginationResponse {
    // TODO: write this properly.
    log: SolapiLog[];
}

export interface GroupMessageResponse extends SolapiMessageSendResponse  {
    groupId: string;
}

export class Group {
    constructor(args: GroupConstructor);
    
    addGroupMessage(messages: Message | Message[]): Promise<SolapiUnknownJSONResponse>;
    sendMessages(): Promise<GroupInfoResponse>;
    getMessageList(queryObject: MessageListQuery): Promise<GroupListResponse>;
    createGroup(): Promise<void>;
    
    deleteGroupMessages(messageId: string): Promise<SolapiUnknownJSONResponse>;
    getGroupId(): string;
    
    static deleteGroup(groupId: string): Promise<GroupDeleteResponse>;
    static getInfo(groupId: string): Promise<GroupInfoResponse>;
    
    static getMyGroupList(query?: any): Promise<GroupListResponse>;
    
    static sendSimpleMessage(message: Message, agent: Agent): Promise<GroupMessageResponse>;
}



/*
* STORAGE
*/

export interface FileUploadPayload {
    file: Base64String;
    type: FileUploadDestinationType;
    name?: string;
    link?: string;
}

export interface FileUploadQuery extends FileUploadPayload {
    fileId: string;
}

export interface FileUploadResult {
    fileId: string;

    // TODO: get this info.
    fileSize: any;

    type: FileUploadDestinationType;
    kakao: any;

    originalName: string;
    name: string;

    // image only:
    width: number;
    height: number;

    dateCreated: string;
    dateUpdated: string;

    link: string;
    references: string;
    url: string;
}

export class Storage {
    constructor(options?: { fileId: string });
    
    getFileId(): string;
    setFileId(fileId: string): void;
    
    // TODO: create proper types for response
    get(params?: FileUploadPayload): Promise<SolapiUnknownJSONResponse>;
    upload(params?: FileUploadPayload): Promise<UploadResult>;
}



/*
* MESSAGE
*/

export type Base64String = string;
type MessageDateType = 'CREATED' | 'UPDATED';

export type FileUploadDestinationType = 'MMS' | 'KAKAO' | 'DOCUMENT';


/*
* MESSAGE - QUERY
*/

export interface GetMessageQuery {
    groupId?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
    dateType?: MessageDateType;
    messageId?: string;
    statusCode?: StatusCode;
    to?: string;
}


/*
* MESSAGE - RESPONSE
*/

export interface MessageInfoResponse {
    [key: string]: MessageInfo;
}

// TODO: check message response and create interface properly
export interface SolapiMessageSendResponse extends SolapiCommonResponse {
    to: string;
    from: string;
    type: MessageType;
    messageId: string;
    accountId: string;
    country: string;
}


/*
* MESSAGE - INFO
*/

export type MessageInfo = SMSInfo | LMSInfo;

export interface SMSInfo {
    groupId: string;
    type: MessageType;
    country: string;
    text: string;
    from: string;
    to: string;
    dateReceived: string;
    status: string;
    statusCode: string;
    reason: string;
    networkName: string;
    log: string;
}

export interface LMSInfo extends SMSInfo {
    subject: string;
    type: 'LMS' | 'MMS';
}


/*
* MESSAGE - TYPING
*/

export namespace msg {
    
    // TODO: check message response and create interface properly
    function send(body: any): Promise<SolapiMessageSendResponse>;
    
    function get_messages(qs?: GetMessageQuery): Promise<MessageInfoResponse>;
    
    function upload(body: FileUploadPayload): Promise<UploadResult>;
    function uploadMMSImage(path: string): Promise<UploadResult>;
    function uploadKakaoImage(path: string, link: string): Promise<UploadResult>;
}
