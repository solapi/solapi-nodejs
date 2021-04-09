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
  * DEPRECATED SINCE: 
  */
 
 export type ImageData = unknown;
 
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
 
     static getMyGroupList(query?: any): Promise<PseudoResponse>;
 
     static sendSimpleMessage(message: Message, agent: Agent): Promise<PseudoResponse>;
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
 export interface SolapiMessageSendResponse extends SolapiUnknownJSONResponse {}
 
 
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
  * MESSAGE - UPLOAD
  */
 
 export interface UploadResult {
     fileId: string;
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
 