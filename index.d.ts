/**
 * SOLAPI SDK JS V4
 * TYPESCRIPT TYPINGS
 */

export interface GroupConstructor {
    groupId?: string;
    agent?: any;
}

export type MessageType = 'SMS' | 'LMS' | 'MMS';
export type Message = AutoTypeMessage | TypeDefinedMessage;

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

export interface KakaoAlimtalkBase extends MessageBase {
    kakaoOptions: {
        pfId: string;
        buttons: KakaoButton[];
    };
}

export interface KakaoChinguTalkBase extends KakaoAlimtalkBase {
    kakaoOptions: {
        imageId?: string;
    };
}

export type KakaoButton = KakaoWebLinkButton | KakaoAppLinkButton | KakaoBotKeywordButton | KakaoMDButton;
export type KakaoButtonType = 'WL' | 'AL' | 'BK' | 'MD';

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

export interface MessageListQuery {
    startKey?: string;
    limit?: number;
    groupId?: string;
}

// TODO: create proper types
export type PseudoResponse = string;

// TODO: create proper types
export type PseudoJSONResponse = object;

// TODO: create proper types
export type ImageData = any;

export interface Agent {
    osPlatform?: string;
    sdkVersion?: string;
}

// apiKey/apiSecret = 1, accessToken = 2
export type HeaderType = 1 | 2;

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

export class Group {
    constructor(args: GroupConstructor);

    addGroupMessage(messages: Message[]): Promise<PseudoResponse>;
    sendMessages(): Promise<PseudoResponse>;
    getMessageList(queryObject: MessageListQuery): Promise<PseudoResponse>;
    createGroup(): Promise<void>;

    deleteGroupMessages(messageId: string): Promise<PseudoResponse>;
    getGroupId(): string;

    static deleteGroup(groupId: string): Promise<PseudoResponse>;
    static getInfo(groupId: string): Promise<PseudoResponse>;

    // TODO: create proper types for query
    static getMyGroupList(query?: any): Promise<PseudoResponse>;

    static sendSimpleMessage(message: Message, agent: Agent): Promise<PseudoResponse>;
}

export class Image {
    constructor(image: ImageData);

    createImage(): Promise<string>;
    getImageId(): string;
}

export class Storage {
    constructor(options?: { fileId: string });
    
    getFileId(): string;
    setFileId(fileId: string): void;

    get(params?: any): Promise<string>;
    upload(params?: UploadParams): Promise<string>;
}

export namespace config {
    function getAuth(headerType?: HeaderType): void;
    function getBaseUrl(): string;

    function getFrom(): string;
    function getTo(): string;

    function init(config: SolapiConfig): void;
    function getUrl(path: string): string;
}

export type Base64String = string;
export type FileUploadDestinationType = 'MMS' | 'KAKAO' | 'DOCUMENT';

export interface FileUploadPayload {
    file: Base64String;
    type: FileUploadDestinationType;
    name?: string;
    link?: string;
}

// TODO: create proper type
type MessageDateType = 'CREATED' | 'UPDATED';
type StatusCode = string;

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

export interface MessageInfoResponse {
    [key: string]: MessageInfo;
}

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
}

export interface MessageInfo {
    groupId: string;
    type: MessageType;
}

export interface UploadResult {
    fileId: string;
}

export namespace msg {
    function send(body: any): Promise<PseudoJSONResponse>;

    function get_messages(qs?: GetMessageQuery): Promise<MessageInfoResponse>;

    function upload(body: FileUploadPayload): Promise<UploadResult>;
    function uploadMMSImage(path: string): Promise<UploadResult>;
    function uploadKakaoImage(path: string, link: string): Promise<UploadResult>;
}

