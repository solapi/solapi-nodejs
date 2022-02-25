import Message from './models/message';
import {
    CreateGroupRequest,
    defaultAgent,
    FileType,
    FileUploadRequest,
    GetGroupMessagesRequest,
    GetGroupsRequest,
    GetMessagesRequest,
    GetMessagesRequestType,
    GetStatisticsRequest,
    GetStatisticsRequestType,
    GroupMessageAddRequest,
    MessageSendingRequest,
    MultipleMessageSendingRequest,
    RemoveMessageIdsToGroupRequest,
    RequestConfig,
    ScheduledDateSendingRequest,
    SingleMessageSendingRequest
} from './requests/messageRequest';
import defaultFetcher from './lib/defaultFetcher';
import {
    AddMessageResponse,
    FileUploadResponse,
    GetBalanceResponse,
    GetGroupsResponse,
    GetMessagesResponse,
    GetStatisticsResponse,
    GroupMessageResponse,
    RemoveGroupMessagesResponse,
    SingleMessageSentResponse
} from './responses/messageResponses';
import {GroupId} from './types/commonTypes';
import queryParameterGenerator from './lib/queryParameterGenerator';
import {formatISO} from 'date-fns';
import stringDateTransfer from './lib/stringDateTrasnfer';
import ImageToBase64 from 'image-to-base64';

type AuthInfo = {
    apiKey: string,
    apiSecret: string
}

export default class SolapiMessageService {
    private readonly baseUrl = 'https://api.solapi.com';
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly authInfo: AuthInfo;

    constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.authInfo = {
            apiKey,
            apiSecret
        };
    }

    /**
     * 메시지 발송 기능
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param data 메시지 데이터, 예약발송을 위한 시간, 중복수신 허용 옵션 등
     */
    async send(data: MessageSendingRequest): Promise<SingleMessageSentResponse | GroupMessageResponse> {
        if (!data.scheduledDate) {
            if (data.messages instanceof Array && data.messages.length > 1) {
                return this.sendMany(data.messages, data.allowDuplicates, data.appId);
            } else {
                if (data.messages instanceof Array && data.messages.length === 0) {
                    throw new Error('Messages must have at least one object.');
                }
                if (data.messages instanceof Array && data.messages.length === 1) {
                    return this.sendOne(data.messages[0], data.appId);
                } else if (!(data.messages instanceof Array)) {
                    return this.sendOne(data.messages, data.appId);
                } else {
                    throw Error('Failed to send message.');
                }
            }
        } else {
            const groupId = await this.createGroup();
            const wrappedMessages = data.messages instanceof Array ? data.messages : [data.messages];
            await this.addMessagesToGroup(groupId, wrappedMessages);
            const scheduledDate = stringDateTransfer(data.scheduledDate);
            return await this.reserveGroup(groupId, scheduledDate);
        }
    }

    /**
     * 단일 메시지 발송 기능
     * @param message 메시지(문자, 알림톡 등)
     * @param appId appstore용 app id
     */
    async sendOne(message: Message, appId?: string): Promise<SingleMessageSentResponse> {
        const parameter = new SingleMessageSendingRequest(message, false, appId);
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/send`
        };
        return await defaultFetcher<SingleMessageSendingRequest, SingleMessageSentResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 여러 메시지 즉시 발송 기능
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param messages 여러 메시지(문자, 알림톡 등)
     * @param allowDuplicates 중복 수신번호 허용
     * @param appId appstore용 app id
     */
    async sendMany(messages: Array<Message>, allowDuplicates = false, appId?: string): Promise<GroupMessageResponse> {
        const parameter = new MultipleMessageSendingRequest(messages, allowDuplicates, appId);
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/send-many`
        };
        return await defaultFetcher<MultipleMessageSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 그룹 생성
     */
    async createGroup(allowDuplicates?: boolean): Promise<GroupId> {
        allowDuplicates = allowDuplicates ?? false;
        const {sdkVersion, osPlatform} = defaultAgent;
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups`
        };
        return await defaultFetcher<CreateGroupRequest, GroupMessageResponse>(this.authInfo, requestConfig, {
            sdkVersion,
            osPlatform,
            allowDuplicates
        }).then(res => res.groupId);
    }

    /**
     * 그룹 메시지 추가
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param groupId 생성 된 Group ID
     * @param messages 여러 메시지(문자, 알림톡 등)
     */
    async addMessagesToGroup(groupId: GroupId, messages: Required<Array<Message>>): Promise<AddMessageResponse> {
        const requestConfig: RequestConfig = {
            method: 'PUT',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/messages`
        };
        return await defaultFetcher<GroupMessageAddRequest, AddMessageResponse>(this.authInfo, requestConfig, new GroupMessageAddRequest(messages));
    }

    /**
     * 그룹 메시지 전송 요청
     * @param groupId 생성 된 Group ID
     */
    async sendGroup(groupId: GroupId): Promise<GroupMessageResponse> {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/send`
        };
        return await defaultFetcher<undefined, GroupMessageResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 예약 발송 설정
     * @param groupId 생성 된 Group ID
     * @param scheduledDate 예약발송 할 날짜
     */
    async reserveGroup(groupId: GroupId, scheduledDate: Date) {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/schedule`
        };
        const formattedScheduledDate = formatISO(scheduledDate);
        return await defaultFetcher<ScheduledDateSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, {
            scheduledDate: formattedScheduledDate
        });
    }

    /**
     * 그룹 통계 정보 조회
     * @param data 그룹 정보 상세 조회용 request 데이터, date 관련 파라미터는 iso8601 포맷으로 보내야 함
     */
    async getGroups(data?: GetGroupsRequest) {
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/groups`, data);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetGroupsResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 내 메시지 목록 조회
     * @param groupId 생성 된 Group ID
     * @param data startkey, limit 등 쿼리 조건 파라미터
     */
    async getGroupMessages(groupId: GroupId, data?: GetGroupMessagesRequest): Promise<GetMessagesResponse> {
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/groups/${groupId}/messages`, data);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetMessagesResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 내 특정 메시지 삭제
     * @param groupId 생성 된 Group Id
     * @param messageIds 생성 된 메시지 ID 목록
     */
    async removeGroupMessages(groupId: GroupId, messageIds: Required<Array<string>>): Promise<RemoveGroupMessagesResponse> {
        const requestConfig: RequestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/messages`
        };
        return await defaultFetcher<RemoveMessageIdsToGroupRequest, RemoveGroupMessagesResponse>(this.authInfo, requestConfig, {messageIds});
    }

    /**
     * 그룹 내 예약 발송 취소(메시지 실패 전체 처리 됨)
     * @param groupId 생성 된 Group ID
     */
    async removeReservationToGroup(groupId: GroupId): Promise<GroupMessageResponse> {
        const requestConfig: RequestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/schedule`
        };
        return await defaultFetcher<undefined, GroupMessageResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 삭제
     * @param groupId
     */
    async removeGroup(groupId: GroupId) {
        const requestConfig: RequestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}`
        };
        return await defaultFetcher<undefined, GroupMessageResponse>(this.authInfo, requestConfig);
    }

    /**
     * 메시지 목록 조회
     * @param data 상세 조건 목록
     */
    async getMessages(data: GetMessagesRequestType): Promise<GetMessagesResponse> {
        const parameter: GetStatisticsRequest | object = data ? new GetMessagesRequest(data) : {};
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/list`, parameter);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetMessagesResponse>(this.authInfo, requestConfig);
    }

    /**
     * 통계 조회
     * @param data 통계 상세 조건 파라미터
     * @returns GetStatisticsResponse 통계 결과
     */
    async getStatistics(data?: GetStatisticsRequestType): Promise<GetStatisticsResponse> {
        const parameter: GetStatisticsRequest | object = data ? new GetStatisticsRequest(data) : {};
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/statistics`, parameter);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetStatisticsResponse>(this.authInfo, requestConfig);
    }

    /**
     * 잔액조회
     * @returns GetBalanceResponse
     */
    async getBalance(): Promise<GetBalanceResponse> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/cash/v1/balance`
        };
        return await defaultFetcher<undefined, GetBalanceResponse>(this.authInfo, requestConfig);
    }

    /**
     * 파일(이미지) 업로드
     * 카카오 친구톡 이미지는 500kb, MMS는 200kb, 발신번호 서류 인증용 파일은 2mb의 제한이 있음
     * @param filePath 해당 파일의 경로 또는 접근 가능한 이미지 URL
     * @param fileType 저장할 파일의 유형, 예) 카카오 친구톡 용 이미지 -> KAKAO, MMS용 사진 -> MMS, 발신번호 서류 인증에 쓰이는 문서 등 -> DOCUMENT, RCS 이미지 -> RCS
     * @param name 파일 이름
     * @param link 파일 링크, 친구톡의 경우 필수 값
     */
    async uploadFile(filePath: string, fileType: FileType, name?: string, link?: string): Promise<FileUploadResponse> {
        const encodedFile = await ImageToBase64(filePath);
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/storage/v1/files`
        };
        const parameter: FileUploadRequest = {
            file: encodedFile,
            type: fileType,
            name,
            link
        };
        return await defaultFetcher<FileUploadRequest, FileUploadResponse>(this.authInfo, requestConfig, parameter);
    }
}
