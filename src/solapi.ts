import {Message} from './models/message';
import {
    CreateGroupRequest,
    CreateKakaoAlimtalkTemplateRequest,
    CreateKakaoChannelRequest,
    CreateKakaoChannelTokenRequest,
    defaultAgent,
    FileType,
    FileUploadRequest,
    GetGroupMessagesRequest,
    GetGroupsRequest,
    GetKakaoAlimtalkTemplatesRequest,
    GetKakaoAlimtalkTemplatesRequestType,
    GetKakaoChannelsRequest,
    GetMessagesRequest,
    GetMessagesRequestType,
    GetStatisticsRequest,
    GetStatisticsRequestType,
    GroupMessageAddRequest,
    KakaoAlimtalkTemplateRequest,
    MultipleDetailMessageSendingRequest,
    MultipleMessageSendingRequest,
    RemoveMessageIdsToGroupRequest,
    RequestConfig,
    ScheduledDateSendingRequest,
    SingleMessageSendingRequest
} from './requests/messageRequest';
import defaultFetcher from './lib/defaultFetcher';
import {
    AddMessageResponse,
    CreateKakaoChannelResponse,
    DetailGroupMessageResponse,
    FileUploadResponse,
    GetBalanceResponse,
    GetGroupsResponse,
    GetKakaoAlimtalkTemplatesResponse,
    GetKakaoChannelsResponse,
    GetMessagesResponse,
    GetStatisticsResponse,
    GroupMessageResponse,
    RemoveGroupMessagesResponse,
    RequestKakaoChannelTokenResponse,
    SingleMessageSentResponse
} from './responses/messageResponses';
import {GroupId} from './types/commonTypes';
import queryParameterGenerator from './lib/queryParameterGenerator';
import {formatISO} from 'date-fns';
import ImageToBase64 from 'image-to-base64';
import stringDateTransfer from './lib/stringDateTrasnfer';
import {MessageNotReceivedError} from './errors/defaultError';
import {KakaoAlimtalkTemplateCategory, KakaoChannel, KakaoChannelCategory} from './models/kakao/kakaoChannel';
import {KakaoAlimtalkTemplate} from './models/kakao/kakaoAlimtalkTemplate';
import qs from 'qs';

type AuthInfo = {
    apiKey: string,
    apiSecret: string
}

/**
 * SOLAPI 메시지 서비스
 * 발송 및 조회 등 SOLAPI에서 제공되는 여러 API의 기능을 쉽게 사용할 수 있습니다.
 * SOLAPI 자체의 서비스에 관한 사항은 SOLAPI 홈페이지를 참고해주세요.
 * @see https://solapi.github.io/solapi-nodejs
 */
export class SolapiMessageService {
    private readonly baseUrl = 'https://api.solapi.com';
    private readonly authInfo: AuthInfo;

    constructor(apiKey: string, apiSecret: string) {
        this.authInfo = {
            apiKey,
            apiSecret
        };
    }

    /**
     * 메시지 발송 기능, sendMany 함수에서 조금 더 개선된 오류 표시 기능등을 제공합니다.
     * 한번의 요청으로 최대 10,000건까지 발송할 수 있습니다.
     * @param messages 발송 요청할 메시지 파라미터(문자, 알림톡 등)
     * @param scheduledDate 예약일시
     * @param allowDuplicates 중복 수신번호 허용 여부
     * @param appId appstore용 app id
     * @throws MessageNotReceivedError 메시지가 모두 발송 접수가 불가한 상태일 경우 MessageNotReceivedError 예외가 발생합니다.
     */
    async send(messages: Message | Array<Message>, scheduledDate?: string | Date, allowDuplicates = false, appId?: string): Promise<DetailGroupMessageResponse> {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        const parameter = new MultipleDetailMessageSendingRequest(messages, allowDuplicates, appId, scheduledDate);
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/send-many/detail`
        };
        return defaultFetcher<MultipleDetailMessageSendingRequest, DetailGroupMessageResponse>(this.authInfo, requestConfig, parameter)
            .then(res => {
                const count = res.groupInfo.count;
                if (res.failedMessageList.length > 0 && count.total === count.registeredFailed) {
                    throw new MessageNotReceivedError(res.failedMessageList);
                }
                return res;
            });
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
        return defaultFetcher<SingleMessageSendingRequest, SingleMessageSentResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 단일 메시지 예약 발송 기능
     * @param message 메시지(문자, 알림톡 등)
     * @param scheduledDate 예약일시
     */
    async sendOneFuture(message: Message, scheduledDate: string | Date): Promise<GroupMessageResponse> {
        const groupId = await this.createGroup();
        await this.addMessagesToGroup(groupId, [message]);
        scheduledDate = stringDateTransfer(scheduledDate);
        return this.reserveGroup(groupId, scheduledDate);
    }

    /**
     * @deprecated 이 기능은 더이상 사용되지 않습니다. send 메소드를 이용하세요!
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
        return defaultFetcher<MultipleMessageSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * @deprecated 이 기능은 더이상 사용되지 않습니다. send 메소드를 이용하세요!
     * 여러 메시지 예약 발송 기능
     * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
     * @param messages 여러 메시지(문자, 알림톡 등)
     * @param scheduledDate 예약 발송 일자
     * @param allowDuplicates 중복 수신번호 허용
     * @param appId appstore용 app id
     */
    async sendManyFuture(messages: Array<Message>, scheduledDate: string | Date, allowDuplicates = false, appId?: string): Promise<GroupMessageResponse> {
        const groupId = await this.createGroup(allowDuplicates, appId);
        await this.addMessagesToGroup(groupId, messages);
        scheduledDate = stringDateTransfer(scheduledDate);
        return this.reserveGroup(groupId, scheduledDate);
    }

    /**
     * 그룹 생성
     */
    async createGroup(allowDuplicates?: boolean, appId?: string): Promise<GroupId> {
        allowDuplicates = allowDuplicates ?? false;
        const {sdkVersion, osPlatform} = defaultAgent;
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/groups`
        };
        return defaultFetcher<CreateGroupRequest, GroupMessageResponse>(this.authInfo, requestConfig, {
            sdkVersion,
            osPlatform,
            allowDuplicates,
            appId
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
        return defaultFetcher<GroupMessageAddRequest, AddMessageResponse>(this.authInfo, requestConfig, new GroupMessageAddRequest(messages));
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
        return defaultFetcher<never, GroupMessageResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<ScheduledDateSendingRequest, GroupMessageResponse>(this.authInfo, requestConfig, {
            scheduledDate: formattedScheduledDate
        });
    }

    /**
     * 단일 그룹정보 조회
     * @param groupId 그룹 ID
     */
    async getGroup(groupId: GroupId): Promise<GroupMessageResponse> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}//messages/v4/groups/${groupId}`
        };
        return defaultFetcher<never, GroupMessageResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<never, GetGroupsResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<never, GetMessagesResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<RemoveMessageIdsToGroupRequest, RemoveGroupMessagesResponse>(this.authInfo, requestConfig, {messageIds});
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
        return defaultFetcher<never, GroupMessageResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<never, GroupMessageResponse>(this.authInfo, requestConfig);
    }

    /**
     * 메시지 목록 조회
     * @param data 목록 조회 상세조건 파라미터
     */
    async getMessages(data?: Readonly<GetMessagesRequestType>): Promise<GetMessagesResponse> {
        const parameter: GetMessagesRequest | object = data ? new GetMessagesRequest(data) : {};
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/list`, parameter);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return defaultFetcher<never, GetMessagesResponse>(this.authInfo, requestConfig);
    }

    /**
     * 통계 조회
     * @param data 통계 상세 조건 파라미터
     * @returns GetStatisticsResponse 통계 결과
     */
    async getStatistics(data?: Readonly<GetStatisticsRequestType>): Promise<GetStatisticsResponse> {
        const parameter: GetStatisticsRequest | object = data ? new GetStatisticsRequest(data) : {};
        const endpoint = queryParameterGenerator(`${this.baseUrl}/messages/v4/statistics`, parameter);
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return defaultFetcher<never, GetStatisticsResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<never, GetBalanceResponse>(this.authInfo, requestConfig);
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
        return defaultFetcher<FileUploadRequest, FileUploadResponse>(this.authInfo, requestConfig, parameter);
    }

    /**
     * 카카오 채널 카테고리 조회
     */
    async getKakaoChannelCategories(): Promise<Array<KakaoChannelCategory>> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/kakao/v2/channels/categories`
        };
        return defaultFetcher<never, Array<KakaoChannelCategory>>(this.authInfo, requestConfig);
    }

    /**
     * 카카오 채널 목록 조회
     * @param data 카카오 채널 목록을 더 자세하게 조회할 때 필요한 파라미터
     */
    async getKakaoChannels(data?: Partial<GetKakaoChannelsRequest>): Promise<GetKakaoChannelsResponse> {
        const parameter = qs.stringify(data, {indices: false});
        const endpoint = `${this.baseUrl}/kakao/v2/channels?${parameter}`;
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return defaultFetcher<never, GetKakaoChannelsResponse>(this.authInfo, requestConfig);
    }

    /**
     * @description 카카오 채널 조회
     * @param channelId 카카오 채널 ID(구 pfId)
     */
    async getKakaoChannel(channelId: string): Promise<KakaoChannel> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/kakao/v2/channels/${channelId}`
        };
        return defaultFetcher<never, KakaoChannel>(this.authInfo, requestConfig);
    }

    /**
     * @description 카카오 채널 연동을 위한 인증 토큰 요청
     */
    async requestKakaoChannelToken(data: CreateKakaoChannelTokenRequest): Promise<RequestKakaoChannelTokenResponse> {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/kakao/v2/channels/token`
        };
        return defaultFetcher<CreateKakaoChannelTokenRequest, RequestKakaoChannelTokenResponse>(this.authInfo, requestConfig, data);
    }

    /**
     * @description 카카오 채널 연동 메소드
     * getKakaoChannelCategories, requestKakaoChannelToken 메소드를 선행적으로 호출해야 합니다!
     */
    async createKakaoChannel(data: CreateKakaoChannelRequest): Promise<CreateKakaoChannelResponse> {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/kakao/v2/channels`
        };
        return defaultFetcher<CreateKakaoChannelRequest, CreateKakaoChannelResponse>(this.authInfo, requestConfig, data);
    }

    /**
     * @description 카카오 채널 삭제, 채널이 삭제 될 경우 해당 채널의 템플릿이 모두 삭제됩니다!
     * @param channelId 카카오 채널 ID
     */
    async removeKakaoChannel(channelId: string): Promise<KakaoChannel> {
        const requestConfig: RequestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/kakao/v2/channels/${channelId}`
        };
        return defaultFetcher<never, KakaoChannel>(this.authInfo, requestConfig);
    }

    /**
     * 카카오 템플릿 목록 조회
     * @param data 카카오 템플릿 목록을 더 자세하게 조회할 때 필요한 파라미터
     */
    async getKakaoAlimtalkTemplates(data?: GetKakaoAlimtalkTemplatesRequestType): Promise<GetKakaoAlimtalkTemplatesResponse> {
        const parameter: GetKakaoAlimtalkTemplatesRequest | object = data ? new GetKakaoAlimtalkTemplatesRequest(data) : {};
        const endpoint = queryParameterGenerator(`${this.baseUrl}/kakao/v2/templates`, parameter);

        const requestConfig: RequestConfig = {
            method: 'GET',
            url: endpoint
        };
        return defaultFetcher<never, GetKakaoAlimtalkTemplatesResponse>(this.authInfo, requestConfig);
    }

    /**
     * 카카오 템플릿 상세 조회
     * @param templateId 카카오 알림톡 템플릿 ID
     */
    async getKakaoAlimtalkTemplate(templateId: string): Promise<KakaoAlimtalkTemplate> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/kakao/v2/templates/${templateId}`
        };
        return defaultFetcher<never, KakaoAlimtalkTemplate>(this.authInfo, requestConfig);
    }

    /**
     * 카카오 템플릿 카테고리 조회
     */
    async getKakaoAlimtalkTemplateCategories(): Promise<Array<KakaoAlimtalkTemplateCategory>> {
        const requestConfig: RequestConfig = {
            method: 'GET',
            url: `${this.baseUrl}/kakao/v2/templates/categories`
        };
        return defaultFetcher<never, Array<KakaoAlimtalkTemplateCategory>>(this.authInfo, requestConfig);
    }

    /**
     * @description 카카오 알림톡 템플릿 생성
     * 반드시 getKakaoAlimtalkTemplateCategories를 먼저 호출하여 카테고리 값을 확인해야 합니다!
     * @param data 알림톡 템플릿 생성을 위한 파라미터
     */
    async createKakaoAlimtalkTemplate(data: CreateKakaoAlimtalkTemplateRequest): Promise<KakaoAlimtalkTemplate> {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/kakao/v2/templates`
        };
        return defaultFetcher<CreateKakaoAlimtalkTemplateRequest, KakaoAlimtalkTemplate>(this.authInfo, requestConfig, data);
    }

    /**
     * 카카오 알림톡 템플릿 검수 요청
     * @param templateId 카카오 알림톡 템플릿 ID
     */
    async requestInspectionKakaoAlimtalkTemplate(templateId: string): Promise<KakaoAlimtalkTemplate> {
        const requestConfig: RequestConfig = {
            method: 'PUT',
            url: `${this.baseUrl}/kakao/v2/templates/${templateId}/inspection`
        };
        return defaultFetcher<never, KakaoAlimtalkTemplate>(this.authInfo, requestConfig);
    }


    /**
     * 카카오 알림톡 템플릿 검수 취소 요청
     * @param templateId 카카오 알림톡 템플릿 ID
     */
    async cancelInspectionKakaoAlimtalkTemplate(templateId: string): Promise<KakaoAlimtalkTemplate> {
        const requestConfig: RequestConfig = {
            method: 'PUT',
            url: `${this.baseUrl}/kakao/v2/templates/${templateId}/inspection/cancel`
        };
        return defaultFetcher<never, KakaoAlimtalkTemplate>(this.authInfo, requestConfig);
    }

    /**
     * 카카오 알림톡 템플릿 수정(검수 X)
     * @param templateId 카카오 알림톡 템플릿 ID
     * @param data 카카오 알림톡 템플릿 수정을 위한 파라미터
     */
    async updateKakaoAlimtalkTemplate(templateId: string, data: KakaoAlimtalkTemplateRequest): Promise<object> {
        const requestConfig: RequestConfig = {
            method: 'PUT',
            url: `${this.baseUrl}/kakao/v2/templates/${templateId}`
        };
        return defaultFetcher<KakaoAlimtalkTemplateRequest, object>(this.authInfo, requestConfig, data);
    }

    /**
     * 카카오 알림톡 템플릿 삭제(대기, 반려 상태일 때만 삭제가능)
     * @param templateId 카카오 알림톡 템플릿 ID
     */
    async deleteKakaoAlimtalkTemplate(templateId: string): Promise<KakaoAlimtalkTemplate> {
        const requestConfig: RequestConfig = {
            method: 'DELETE',
            url: `${this.baseUrl}/kakao/v2/templates/${templateId}`
        };
        return defaultFetcher<unknown, KakaoAlimtalkTemplate>(this.authInfo, requestConfig, {});
    }
}
