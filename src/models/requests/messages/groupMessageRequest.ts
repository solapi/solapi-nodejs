import {Message} from '../../base/messages/message';
import type {DefaultAgentType} from './requestConfig';

/**
 * 그룹 메시지 추가 요청
 */
export class GroupMessageAddRequest {
  messages: ReadonlyArray<Message>;

  constructor(messages: Array<Message>) {
    this.messages = messages;
  }
}

/**
 * 그룹 예약 발송 설정 요청
 */
export type ScheduledDateSendingRequest = {
  scheduledDate: string;
};

/**
 * 그룹에서 특정 메시지 삭제 요청
 */
export type RemoveMessageIdsToGroupRequest = {
  messageIds: ReadonlyArray<string>;
};

/**
 * 그룹 내 메시지 목록 조회 요청
 */
export type GetGroupMessagesRequest = {
  startKey?: string;
  limit?: number;
};

/**
 * Storage API에서 사용하는 파일 ID 컬렉션 타입
 */
export type FileIds = {
  fileIds: ReadonlyArray<string>;
};

export type FileType = 'KAKAO' | 'MMS' | 'DOCUMENT' | 'RCS' | 'FAX';

export type FileUploadRequest = {
  file: string;
  type: FileType;
  name?: string;
  link?: string;
};

/**
 * 그룹 생성 요청 타입
 */
export type CreateGroupRequest = DefaultAgentType & {
  allowDuplicates: boolean;
  appId?: string;
  customFields?: Record<string, string>;
};
