import Message from './models/message';
import {
    defaultAgent,
    DefaultAgentType,
    GetGroupMessagesRequest,
    GetGroupsRequest,
    GroupMessageAddRequest,
    MultipleMessageSendingRequest,
    RemoveMessageIdsToGroupRequest,
    ScheduledDateSendingRequest,
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
import queryParameterGenerator from './lib/queryParameterGenerator';
import {formatISO, isValid, parseISO} from 'date-fns';

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
     * @param scheduledDate 예약발송을 위한 날짜, 입력 시 예약발송 처리 됨
     * @param appId appstore용 app id
     */
    async sendOne(message: Message, scheduledDate?: string | Date, appId?: string): Promise<SingleMessageSentResponse | GroupMessageResponse> {
        if (!scheduledDate) {
            const parameter = new SingleMessageSendingRequest(message, false, appId);
            const requestConfig = {
                method: 'POST',
                url: `${this.baseUrl}/messages/v4/send`
            };
            return await defaultFetcher<SingleMessageSendingRequest, SingleMessageSentResponse>(this.authInfo, requestConfig, parameter);
        } else {
            const groupId = await this.createGroup();
            await this.addMessagesToGroup(groupId, [message]);
            if (isValid(scheduledDate)) {
                throw new Error('Invalid Scheduled Date');
            }
            if (typeof scheduledDate === 'string') {
                scheduledDate = parseISO(scheduledDate);
            }
            return await this.reserveGroup(groupId, scheduledDate);
        }
    }

    /**
     * 여러 메시지 즉시 발송 기능
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param messages 여러 메시지(문자, 알림톡 등)
     * @param allowDuplicates 중복 수신번호 허용
     * @param scheduledDate 예약발송을 위한 날짜, 입력 시 예약발송 처리 됨
     * @param appId appstore용 app id
     */
    async sendMany(messages: Required<Array<Message>>, allowDuplicates = false, scheduledDate?: string | Date, appId?: string): Promise<GroupMessageResponse> {
        if (!scheduledDate) {
            const parameter = new MultipleMessageSendingRequest(messages, allowDuplicates, appId);
            const requestConfig = {
                method: 'POST',
                url: `${this.baseUrl}/messages/v4/send-many`
            };
            return await defaultFetcher<MultipleMessageSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, parameter);
        } else {
            const groupId = await this.createGroup();
            await this.addMessagesToGroup(groupId, messages);
            if (isValid(scheduledDate)) {
                throw new Error('Invalid Scheduled Date');
            }
            if (typeof scheduledDate === 'string') {
                scheduledDate = parseISO(scheduledDate);
            }
            return await this.reserveGroup(groupId, scheduledDate);
        }
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
        return await defaultFetcher<GroupMessageAddRequest, AddMessageResponse>(this.authInfo, requestConfig, new GroupMessageAddRequest(messages));
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
     * 그룹 예약 발송 설정
     * @param groupId 생성 된 Group ID
     * @param scheduledDate 예약발송 할 날짜
     */
    async reserveGroup(groupId: GroupId, scheduledDate: Date) {
        const requestConfig = {
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
        const requestConfig = {
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
    async getGroupMessages(groupId: GroupId, data?: GetGroupMessagesRequest): Promise<GetGroupMessagesResponse> {
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/groups/${groupId}/messages`, data);
        const requestConfig = {
            method: 'GET',
            url: endpoint
        };
        return await defaultFetcher<undefined, GetGroupMessagesResponse>(this.authInfo, requestConfig);
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
        return await defaultFetcher<RemoveMessageIdsToGroupRequest, RemoveGroupMessagesResponse>(this.authInfo, requestConfig, {messageIds});
    }

    /**
     * 그룹 내 예약 발송 취소(메시지 실패 전체 처리 됨)
     * @param groupId 생성 된 Group ID
     */
    async removeReservationToGroup(groupId: GroupId): Promise<GroupMessageResponse> {
        const requestConfig = {
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
        const requestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/messages/v4/groups/${groupId}`
        };
        return await defaultFetcher<undefined, GroupMessageResponse>(this.authInfo, requestConfig);
    }
}
