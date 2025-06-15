import {GroupId} from '@internal-types/commonTypes';
import stringifyQuery from '@lib/stringifyQuery';
import {Message} from '@models/base/messages/message';
import {
  GetGroupsFinalizeRequest,
  GetGroupsRequest,
} from '@models/requests/messages/getGroupsRequest';
import {
  CreateGroupRequest,
  GetGroupMessagesRequest,
  GroupMessageAddRequest,
  RemoveMessageIdsToGroupRequest,
  ScheduledDateSendingRequest,
} from '@models/requests/messages/groupMessageRequest';
import {
  AddMessageResponse,
  GetGroupsResponse,
  GetMessagesResponse,
  GroupMessageResponse,
  RemoveGroupMessagesResponse,
} from '@models/responses/messageResponses';
import {formatISO} from 'date-fns';
import DefaultService from '../defaultService';

/**
 * 그룹 서비스
 * 그룹 생성, 메시지 추가 등 그룹 관련 기능을 제공합니다.
 */
export default class GroupService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 그룹 생성
   * @param allowDuplicates 생성할 그룹이 중복 수신번호를 허용하는지 여부를 확인합니다.
   * @param appId 생성할 그룹에 특정 appId를 넣을 수 있습니다.
   * @param customFields 생성할 그룹에 사용자 정의 데이터를 Record 형태로 삽입할 수 있습니다.
   */
  async createGroup(
    allowDuplicates: boolean = false,
    appId?: string,
    customFields?: Record<string, string>,
  ): Promise<GroupId> {
    const {sdkVersion, osPlatform} = {
      sdkVersion: 'nodejs/5.5.0',
      osPlatform: `${process.platform} | ${process.version}`,
    };

    return this.request<CreateGroupRequest, GroupMessageResponse>({
      httpMethod: 'POST',
      url: 'messages/v4/groups',
      body: {
        sdkVersion,
        osPlatform,
        allowDuplicates,
        appId,
        customFields,
      },
    }).then(res => res.groupId);
  }

  /**
   * 그룹 메시지 추가
   * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
   * 추가 가능한 최대 메시지 건 수는 1,000,000건 입니다.
   * @param groupId 생성 된 Group ID
   * @param messages 여러 메시지(문자, 알림톡 등)
   */
  async addMessagesToGroup(
    groupId: GroupId,
    messages: Array<Message>,
  ): Promise<AddMessageResponse> {
    return this.request<GroupMessageAddRequest, AddMessageResponse>({
      httpMethod: 'PUT',
      url: `messages/v4/groups/${groupId}/messages`,
      body: new GroupMessageAddRequest(messages),
    });
  }

  /**
   * 그룹 메시지 전송 요청
   * @param groupId 생성 된 Group ID
   */
  async sendGroup(groupId: GroupId): Promise<GroupMessageResponse> {
    return this.request<never, GroupMessageResponse>({
      httpMethod: 'POST',
      url: `messages/v4/groups/${groupId}/send`,
    });
  }

  /**
   * 그룹 예약 발송 설정
   * @param groupId 생성 된 Group ID
   * @param scheduledDate 예약발송 할 날짜
   */
  async reserveGroup(groupId: GroupId, scheduledDate: Date | string) {
    const formattedScheduledDate = formatISO(scheduledDate);
    return this.request<ScheduledDateSendingRequest, GroupMessageResponse>({
      httpMethod: 'POST',
      url: `messages/v4/groups/${groupId}/schedule`,
      body: {
        scheduledDate: formattedScheduledDate,
      },
    });
  }

  /**
   * 그룹 내 예약 발송 취소(메시지 실패 전체 처리 됨)
   * @param groupId 생성 된 Group ID
   */
  async removeReservationToGroup(
    groupId: GroupId,
  ): Promise<GroupMessageResponse> {
    return this.request<never, GroupMessageResponse>({
      httpMethod: 'DELETE',
      url: `messages/v4/groups/${groupId}/schedule`,
    });
  }

  /**
   * 그룹 목록 정보 조회
   * @param data 그룹 정보 상세 조회용 request 데이터
   */
  async getGroups(data?: GetGroupsRequest): Promise<GetGroupsResponse> {
    let payload: GetGroupsFinalizeRequest = {};
    if (data) {
      payload = new GetGroupsFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetGroupsResponse>({
      httpMethod: 'GET',
      url: `messages/v4/groups${parameter}`,
    });
  }

  /**
   * 단일 그룹정보 조회
   * @param groupId 그룹 ID
   */
  async getGroup(groupId: GroupId): Promise<GroupMessageResponse> {
    return this.request<never, GroupMessageResponse>({
      httpMethod: 'GET',
      url: `messages/v4/groups/${groupId}`,
    });
  }

  /**
   * 그룹 내 메시지 목록 조회
   * @param groupId 생성 된 Group ID
   * @param data startkey, limit 등 쿼리 조건 파라미터
   */
  async getGroupMessages(
    groupId: GroupId,
    data?: GetGroupMessagesRequest,
  ): Promise<GetMessagesResponse> {
    const parameter = stringifyQuery(data, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetMessagesResponse>({
      httpMethod: 'GET',
      url: `messages/v4/groups/${groupId}/messages${parameter}`,
    });
  }

  /**
   * 그룹 내 특정 메시지 삭제
   * @param groupId 생성 된 Group Id
   * @param messageIds 생성 된 메시지 ID 목록
   */
  async removeGroupMessages(
    groupId: GroupId,
    messageIds: Array<string>,
  ): Promise<RemoveGroupMessagesResponse> {
    return this.request<
      RemoveMessageIdsToGroupRequest,
      RemoveGroupMessagesResponse
    >({
      httpMethod: 'DELETE',
      url: `messages/v4/groups/${groupId}/messages`,
      body: {messageIds},
    });
  }

  /**
   * 그룹 삭제
   * @param groupId
   */
  async removeGroup(groupId: GroupId): Promise<GroupMessageResponse> {
    return this.request<never, GroupMessageResponse>({
      httpMethod: 'DELETE',
      url: `messages/v4/groups/${groupId}`,
    });
  }
}
