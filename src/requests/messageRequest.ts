import {Message, MessageType} from '../models/message';
import {DateOperatorType} from '../types/commonTypes';
import {formatWithTransfer} from '../lib/stringDateTrasnfer';
import {kakaoOptionRequest} from './kakao/kakaoOptionRequest';
import {RcsOptionRequest} from '../models/rcs/rcsOption';

export type DefaultAgentType = {
  sdkVersion: string;
  osPlatform: string;
  appId?: string;
};

// NOTE: Need to update when publish library.
const sdkVersion = 'nodejs/5.4.0';

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

export type MessageParameter = {
  to: string | Array<string>;
  from?: string;
  text?: string;
  imageId?: string;
  type?: MessageType;
  subject?: string;
  autoTypeDetect?: boolean;
  kakaoOptions?: kakaoOptionRequest;
  rcsOptions?: RcsOptionRequest;
  country?: string;
  customFields?: Record<string, string>;
  replacements?: Array<object>;
  faxOptions?: FileIds;
};

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

export type FileIds = {
  fileIds: Array<string>;
};

export type FileType = 'KAKAO' | 'MMS' | 'DOCUMENT' | 'RCS' | 'FAX';

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
