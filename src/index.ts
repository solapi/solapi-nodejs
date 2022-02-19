import Message from './models/message';
import {
    defaultAgent,
    DefaultAgentType,
    GetGroupMessagesRequest,
    GetGroupsRequest,
    MultipleMessageSendingRequest,
    SingleMessageSendingRequest
} from './requests/messageRequest';
import defaultFetcher from './lib/defaultFetcher';
import {
    AddMessageResponse,
    GetGroupMessagesResponse,
    GetGroupsResponse,
    GroupMessageResponse,
    RemoveGroupMessagesResponse,
    SingleMessageSentResponse
} from './responses/messageResponses';
import {GroupId} from './types/commonTypes';
import {URLSearchParams} from 'url';

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
     * 단일 메시지 발송 기능
     * @param message 메시지(문자, 알림톡 등)
     * @param allowDuplicates 중복 수신번호 허용
     * @param appId appstore용 app id
     */
    async sendOne(message: Message, allowDuplicates = false, appId?: string): Promise<SingleMessageSentResponse> {
        const parameter = new SingleMessageSendingRequest(message, allowDuplicates, appId);
        const requestConfig = {
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
    async sendMany(messages: Required<Array<Message>>, allowDuplicates = false, appId?: string): Promise<GroupMessageResponse> {
        const parameter = new MultipleMessageSendingRequest(messages, allowDuplicates, appId);
        const requestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/send-many`
        };
        return await defaultFetcher<MultipleMessageSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 그룹 생성
     */
    async createGroup(): Promise<GroupId> {
        const requestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups`
        };
        return await defaultFetcher<DefaultAgentType, GroupMessageResponse>(this.authInfo, requestConfig, defaultAgent).then(res => res.groupId);
    }

    /**
     * 그룹 메시지 추가
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param groupId 생성 된 Group ID
     * @param messages 여러 메시지(문자, 알림톡 등)
     */
    async addMessagesToGroup(groupId: GroupId, messages: Required<Array<Message>>): Promise<AddMessageResponse> {
        const requestConfig = {
            method: 'PUT',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/messages`
        };
        return await defaultFetcher<Array<Message>, AddMessageResponse>(this.authInfo, requestConfig, messages);
    }

    /**
     * 그룹 메시지 전송 요청
     * @param groupId 생성 된 Group ID
     */
    async sendGroup(groupId: GroupId): Promise<GroupMessageResponse> {
        const requestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/send`
        };
        return await defaultFetcher<undefined, GroupMessageResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 정보 조회
     * @param data 그룹 정보 상세 조회용 request 데이터
     */
    async getGroups(data?: GetGroupsRequest) {
        const apiUrl = new URL(`${this.baseUrl}/messages/v4/groups`);
        if (data) {
            const urlSearchParams = new URLSearchParams();
            Object.keys(data).forEach(key => {
                const reflectedValue = Reflect.get(data, key);
                if (reflectedValue) {
                    urlSearchParams.set(key, reflectedValue);
                }
            });
            apiUrl.search = urlSearchParams.toString();
        }
        const endpoint = apiUrl.toString();
        const requestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetGroupsResponse>(this.authInfo, requestConfig);
    }

    /**
     * 그룹 내 메시지 목록 조회
     * @param groupId 생성 된 Group ID
     * @param startKey 페이징을 위한 조회 키
     * @param limit 한번 조회로 표시될 데이터 갯수
     */
    async getGroupMessages(groupId: GroupId, startKey?: string, limit?: number): Promise<GetGroupMessagesResponse> {
        const parameter: GetGroupMessagesRequest = {
            startKey,
            limit
        };
        const requestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/messages`
        };
        return await defaultFetcher<GetGroupMessagesRequest, GetGroupMessagesResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 그룹 내 특정 메시지 삭제
     * @param groupId 생성 된 Group Id
     * @param messageIds 생성 된 메시지 ID 목록
     */
    async removeGroupMessages(groupId: GroupId, messageIds: Required<Array<string>>): Promise<RemoveGroupMessagesResponse> {
        const requestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}/messages`
        };
        return await defaultFetcher<Array<string>, RemoveGroupMessagesResponse>(this.authInfo, requestConfig, messageIds);
    }

    /**
     * 그룹 삭제
     * @param groupId
     */
    async removeGroup(groupId: GroupId) {
        const requestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}`
        };
        return await defaultFetcher<object, GroupMessageResponse>(this.authInfo, requestConfig, {});
    }
}
