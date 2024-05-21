import {Message} from '../models/message';
import {DateOperatorType} from '../types/commonTypes';
import {formatWithTransfer} from '../lib/stringDateTrasnfer';

export type DefaultAgentType = {
  sdkVersion: string;
  osPlatform: string;
  appId?: string;
};

const sdkVersion = 'nodejs/5.2.0';

export const defaultAgent: DefaultAgentType = {
  sdkVersion,
  osPlatform: `${process.platform} | ${process.version}`,
};

abstract class DefaultMessageRequest {
  allowDuplicates: boolean;
  protected agent: DefaultAgentType;

  protected constructor() {
    this.agent = defaultAgent;
    this.allowDuplicates = false;
  }
}

export class SingleMessageSendingRequest extends DefaultMessageRequest {
  message: Message;

  constructor(message: Message, allowDuplicates?: boolean, appId?: string) {
    super();
    this.message = message;
    if (typeof allowDuplicates === 'boolean') {
      this.allowDuplicates = allowDuplicates;
    }
    if (appId) {
      this.agent.appId = appId;
    }
  }
}

export class MultipleMessageSendingRequest extends DefaultMessageRequest {
  messages: Array<Message>;

  constructor(
    messages: Array<Message>,
    allowDuplicates?: boolean,
    appId?: string,
  ) {
    super();
    this.messages = messages;
    if (typeof allowDuplicates === 'boolean') {
      this.allowDuplicates = allowDuplicates;
    }
    if (appId) {
      this.agent.appId = appId;
    }
  }
}

export class MultipleDetailMessageSendingRequest extends DefaultMessageRequest {
  messages: Array<Message>;
  scheduledDate: string;
  showMessageList: boolean;

  constructor(
    messages: Array<Message>,
    allowDuplicates?: boolean,
    appId?: string,
    scheduledDate?: string | Date,
    showMessageList?: boolean,
  ) {
    super();
    this.messages = messages;
    if (allowDuplicates) {
      this.allowDuplicates = allowDuplicates;
    }
    if (appId) {
      this.agent.appId = appId;
    }
    if (scheduledDate) {
      this.scheduledDate = formatWithTransfer(scheduledDate);
    }
    if (showMessageList) {
      this.showMessageList = showMessageList;
    }
  }
}

export class GroupMessageAddRequest {
  messages: Array<Message>;

  constructor(messages: Array<Message>) {
    this.messages = messages;
  }
}

export type ScheduledDateSendingRequest = {
  scheduledDate: string;
};

export type RemoveMessageIdsToGroupRequest = {
  messageIds: Array<string>;
};

export type GetGroupMessagesRequest = {
  startKey?: string;
  limit?: number;
};

export type RequestConfig = {
  method: string;
  url: string;
};

export type FileType = 'KAKAO' | 'MMS' | 'DOCUMENT' | 'RCS';

export type FileUploadRequest = {
  file: string;
  type: FileType;
  name?: string;
  link?: string;
};

export type CreateGroupRequest = DefaultAgentType & {
  allowDuplicates: boolean;
  appId?: string;
  customFields?: Record<string, string>;
};

/**
 * @description GET API 중 일부 파라미터 조회 시 필요한 객체
 * @see https://docs.solapi.com/api-reference/overview#operator
 */
export type DatePayloadType = {
  [key in DateOperatorType]?: string | Date;
};

export type CreateKakaoChannelTokenRequest = {
  searchId: string;
  phoneNumber: string;
};

export type CreateKakaoChannelRequest = {
  searchId: string;
  phoneNumber: string;
  categoryCode: string;
  token: string;
};
