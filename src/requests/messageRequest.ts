import {Message, MessageType} from '../models/message';
import {DateOperatorType, GroupId} from '../types/commonTypes';
import {formatISO} from 'date-fns';
import stringDateTransfer from '../lib/stringDateTrasnfer';
import {KakaoButton} from '../models/kakao/kakaoButton';
import {
  KakaoAlimtalkTemplateEmphasizeType,
  KakaoAlimtalkTemplateMessageType,
} from '../models/kakao/kakaoAlimtalkTemplate';

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
      this.scheduledDate = formatISO(stringDateTransfer(scheduledDate));
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

export type GetGroupsRequest = {
  startKey?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type RequestConfig = {
  method: string;
  url: string;
};

type DateType = 'CREATED' | 'UPDATED';

export type GetMessagesRequestType = {
  startKey?: string;
  limit?: number;
  messageId?: string;
  messageIds?: Array<string>;
  groupId?: GroupId;
  to?: string;
  from?: string;
  type?: MessageType;
  statusCode?: string;
  duration?: {
    dateType?: DateType;
    startDate: string;
    endDate: string;
  };
};

export class GetMessagesRequest {
  readonly startKey?: string;
  readonly limit?: number;
  readonly dateType?: DateType = 'CREATED';
  readonly messageId?: string;
  readonly messageIds?: Array<string>;
  readonly groupId?: GroupId;
  readonly to?: string;
  readonly from?: string;
  readonly type?: MessageType;
  readonly statusCode?: string;
  readonly startDate?: string;
  readonly endDate?: string;

  constructor(getMessageRequestType: GetMessagesRequestType) {
    this.startKey = getMessageRequestType.startKey;
    this.limit = getMessageRequestType.limit;
    if (getMessageRequestType.duration?.dateType)
      this.dateType = getMessageRequestType.duration.dateType;
    if (getMessageRequestType.duration)
      this.startDate = formatISO(
        stringDateTransfer(getMessageRequestType.duration.startDate),
      );
    if (getMessageRequestType.duration)
      this.endDate = formatISO(
        stringDateTransfer(getMessageRequestType.duration.endDate),
      );
    this.messageId = getMessageRequestType.messageId;
    this.messageIds = getMessageRequestType.messageIds;
    this.groupId = getMessageRequestType.groupId;
    this.to = getMessageRequestType.to;
    this.from = getMessageRequestType.from;
    this.type = getMessageRequestType.type;
    this.statusCode = getMessageRequestType.statusCode;
  }
}

export type GetStatisticsRequestType = {
  duration?: {
    startDate: string | Date;
    endDate: string | Date;
  };
  masterAccountId: string;
};

export class GetStatisticsRequest {
  readonly startDate: string;
  readonly endDate: string;
  readonly masterAccountId: string;

  constructor(getStatisticsRequest: GetStatisticsRequestType) {
    if (getStatisticsRequest.duration)
      this.startDate = formatISO(
        stringDateTransfer(getStatisticsRequest.duration.startDate),
      );
    if (getStatisticsRequest.duration)
      this.endDate = formatISO(
        stringDateTransfer(getStatisticsRequest.duration.endDate),
      );
    this.masterAccountId = getStatisticsRequest.masterAccountId;
  }
}

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

/**
 * @description 카카오 알림톡 템플릿 요청 타입
 */
export type KakaoAlimtalkTemplateRequest = {
  /**
   * @description 알림톡 템플릿 제목
   */
  name?: string;
  /**
   * @description 알림톡 템플릿 내용
   */
  content?: string;
  /**
   * @description 알림톡 템플릿 카테고리 코드, KakaoAlimtalkTemplateCategory 타입 참고
   */
  categoryCode?: string;
  /**
   * @description 알림톡 템플릿 버튼 배열
   */
  buttons?: Array<KakaoButton>;
  /**
   * @description 알림톡 템플릿 메시지 유형
   */
  messageType?: KakaoAlimtalkTemplateMessageType;
  /**
   * @description 카카오 알림톡 템플릿 강조 유형
   */
  emphasizeType?: KakaoAlimtalkTemplateEmphasizeType;
  /**
   * @description 부가정보, 치환문구를 넣을 수 없음
   */
  extra?: string;
  /**
   * @description 강조 표기 제목 (강조 표기형 유형만 등록 가능)
   */
  emphasizeTitle?: string;
  /**
   * @description 강조 표기 부제목 (강조 표기형 유형만 등록 가능)
   */
  emphasizeSubtitle?: string;
  /**
   * @description 보안 템플릿 여부
   */
  securityFlag?: boolean;
  /**
   * @description 알림톡 템플릿 내에 업로드 할 이미지 ID (Storage API 사용 필요)
   */
  imageId?: string;
};

/**
 * @description 카카오 알림톡 템플릿 생성 요청 타입
 * @see {@link KakaoAlimtalkTemplateRequest}
 * @param channelId - 카카오 비즈니스 채널 ID
 * @param channelGroupId - 카카오 비즈니스 채널 그룹 ID
 */
export type CreateKakaoAlimtalkTemplateRequest =
  KakaoAlimtalkTemplateRequest & {
    name: string;
    channelId?: string;
    channelGroupId?: string;
  };
