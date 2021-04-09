/**
 * SOLAPI SDK JS V4
 * TYPESCRIPT TYPINGS
 */

declare module 'solapi' {
    
    /*
     * RESPONSES
     */
    
    // TODO: create proper type
    type StatusCode = string;
    
    export interface SolapiCommonResponse {
        status?: string;
        statusCode?: StatusCode;
        statusMessage?: string;
        errorCount?: number;
        errorCode?: string;
        errorMessage?: string;
    }
    
    export interface SolapiPaginationResponse extends SolapiCommonResponse {
        nextKey: string;
        startKey: string;
        limit?: number;
    }
    
    export type SolapiActionStatus = 'SENDING' | 'PENDING' | 'COMPLETE';
    export type SolapiDate = string;
     
    export interface SolapiLog {
        createAt: SolapiDate;
        message: string;
        oldBalance?: number;
        newBalance?: number;
        oldPoint?: number;
        newPoint?: number;
        totalPrice?: number;
    }
    
    export interface PerLocaleCodes<T> {
        [locale: string]: T;
    }
    
    export interface SolapiPaymentStatus {
        requested: number;
        replacement: number;
        refund: number;
        sum: number;
    }
    
    export interface SolapiEachService<T> {
        sms: T;
        lms: T;
        mms: T;
        ata: T;
        cta: T;
        cti: T;
        nsa: T;
    }
    
    export interface SolapiCommonActionResponse extends SolapiCommonResponse {
        _id: string;
        groupId?: string;
        accountId: string;
        dateCreated: SolapiDate | null;
        dateUpdated: SolapiDate | null;
        customFields: any;
        
        log: SolapiLog[];
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
        kakaoOptions: KakaoAlimtalkOptions;
    }
    export interface KakaoChinguTalkMessage extends MessageBase {
        type?: 'CTA';
        kakaoOptions: KakaoChinguTalkOptions
    }
    
    export type KakaoOptions = KakaoChinguTalkOptions | KakaoAlimtalkOptions;
    
    export interface KakaoOptionsCommon {
        senderKey?: string | null;
        templateCode?: string | null;
        templateId?: string | null;
        buttonName?: string | null;
        buttonUrl?: string | null;
        disableSms?: boolean;
        buttons: KakaoButton[];
        pfId: string | null;
        title?: string | null;
    }
    
    export interface KakaoChinguTalkOptions extends KakaoOptionsCommon {
        imageId?: string | null;
    }
    
    export interface KakaoAlimTalkOptions extends KakaoOptionsCommon {}
    
    
    
    
    /*
     * MESSAGES - BUTTONS
     */
    
    export type KakaoButton = KakaoWebLinkButton | KakaoAppLinkButton | KakaoBotKeywordButton | KakaoMakeDiscussionButton | KakaoAddChannelButton | KakaoBusinessChatButton | KakaoChatBotButton;
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
    
    export interface KakaoMakeDiscussionButton extends KakaoButtonBase {
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
        apiKey?: string;
        apiSecret?: string;
        accessToken?: string;
        to?: string;
        from?: string;
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
    
    export interface GroupMessageResponse extends SolapiMessageSendResponse  {
        groupId: string;
    }
    
    export interface GroupInfoResponse extends SolapiCommonActionResponse {
        count: {
            total: number;
            sentTotal: number;
            sentFailed: number;
            sentSuccess: number;
            sentPending: number;
            sentReplacement: number;
            refund: number;
            registeredFailed: number;
            registeredSuccess: number;
        };
        countForCharge: SolapiEachService<PerLocaleCodes<number>>;
        balance: {
            requested: number;
        };
        balance: SolapiPaymentStatus;
        point: SolapiPaymentStatus;
        app: {
            profit: SolapiEachService<number>;
            appId: string;
            version: string;
        }
        serviceMethod: string;
        sdkVersion: string | null;
        osPlatform: string | null;
        status: SolapiActionStatus;
        dateSent: SolapiDate | null;
        dateCompleted?: SolapiDate | null;
        isRefunded?: boolean;
        flagUpdated?: boolean;
        prepaid?: boolean;
        strict?: boolean;
        masterAccountId?: string | null;
        apiVersion: string;
        customFields?: any;
        hint?: string | null;
        price: SolapiEachService<number>;
    }
    
    export class Group {
        constructor(args?: GroupConstructor);
        
        addGroupMessage(messages: Message | Message[]): Promise<SolapiActionResponse>;
        sendMessages(): Promise<SolapiActionResponse>;
        getMessageList(queryObject?: MessageListQuery): Promise<GroupListResponse>;
        createGroup(): Promise<void>;
        
        deleteGroupMessages(messageId: string): Promise<SolapiActionResponse>;
        getGroupId(): string;
        
        static deleteGroup(groupId: string): Promise<GroupDeleteResponse>;
        static getInfo(groupId: string): Promise<SolapiActionResponse>;
        
        static getMyGroupList(query?: any): Promise<GroupListResponse>;
        
        static sendSimpleMessage(message?: Message, agent?: Agent): Promise<GroupMessageResponse>;
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
        get(params?: FileUploadPayload): Promise<SolapiActionResponse>;
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
        startDate?: SolapiDate;
        endDate?: SolapiDate;
        dateType?: MessageDateType;
        messageId?: string;
        statusCode?: StatusCode;
        to?: string;
    }
    
    
    /*
    * MESSAGE - RESPONSE
    */
    
    export interface MessageListResponse {
        [key: string]: MessageInfo;
    }
    
    
    /*
    * MESSAGE - INFO
    */
    
    export type MessageInfoResponse = MessageInfo & SolapiCommonActionResponse;
    export type MessageInfo = SMSInfo | LMSInfo;
    
    export interface SMSInfo {
        groupId: string;
        messageId: string;
        type: MessageType;
        country: string;
        text: string;
        from: string;
        to: string;
        dateReceived: SolapiDate;
        reason: string;
        networkCode: string;
        networkName: string;
        log: string;
        replacement: boolean;
        autoTypeDetect: boolean;
        subject: null;
        imageId: null;
    
        routedQueue?: string;
        usedQueue?: string[];
        dataProcessed?: SolapiDate;
        dateReported?: SolapiDate;
    }
    
    export interface LMSInfo extends SMSInfo {
        subject: string;
        type: 'LMS';
    }
    
    export interface MMSInfo extends SMSInfo {
        subject: string;
        imageId: string | null;
        type: 'MMS';
    }
    
    export interface KakaoInfo extends SMSInfo {
        subject: string;
        imageId: string | null;
        type: 'ATA' | 'CTA';
        kakaoOptions: KakaoOptions;
    }
    
    export interface NaverInfo extends SMSInfo {
        subject: string;
        imageId: string | null;
        type: 'NSA';
        naverOptions: NaverOptions;
    }
    
    /*
    * MESSAGE - TYPING
    */
    
    export interface MessageQuery {
        messages: Message[];
    }
    
    
    export namespace msg {
        
        // TODO: check message response and create interface properly
        function send(body: MessageQuery): Promise<SolapiMessageSendResponse>;
        
        function get_messages(qs?: GetMessageQuery): Promise<MessageListResponse>;
        
        function upload(body: FileUploadPayload): Promise<UploadResult>;
        function uploadMMSImage(path: string): Promise<UploadResult>;
        function uploadKakaoImage(path: string, link: string): Promise<UploadResult>;
    }

}
