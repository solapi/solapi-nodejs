import {Message, MessageType} from '../models/message';
import {GroupId} from '../types/commonTypes';
import {formatISO} from 'date-fns';
import stringDateTransfer from '../lib/stringDateTrasnfer';

export type DefaultAgentType = {
    sdkVersion: string
    osPlatform: string
};

const sdkVersion = 'nodejs/5.1.0';

export const defaultAgent: DefaultAgentType = {
    sdkVersion,
    osPlatform: `${process.platform} | ${process.version}`,
};

abstract class DefaultMessageRequest {
    allowDuplicates: boolean;
    appId: string | undefined;
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
            this.appId = appId;
        }
    }
}

export class MultipleMessageSendingRequest extends DefaultMessageRequest {
    messages: Array<Message>;

    constructor(messages: Array<Message>, allowDuplicates?: boolean, appId?: string) {
        super();
        this.messages = messages;
        if (typeof allowDuplicates === 'boolean') {
            this.allowDuplicates = allowDuplicates;
        }
        if (appId) {
            this.appId = appId;
        }
    }
}

export class MultipleDetailMessageSendingRequest extends DefaultMessageRequest {
    messages: Array<Message>;
    scheduledDate: string;

    constructor(messages: Array<Message>, allowDuplicates?: boolean, appId?: string, scheduledDate?: string | Date) {
        super();
        this.messages = messages;
        if (typeof allowDuplicates === 'boolean') {
            this.allowDuplicates = allowDuplicates;
        }
        if (appId) {
            this.appId = appId;
        }
        if (scheduledDate) {
            this.scheduledDate = formatISO(stringDateTransfer(scheduledDate));
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
    scheduledDate: string
}

export type RemoveMessageIdsToGroupRequest = {
    messageIds: Array<string>
}

export type GetGroupMessagesRequest = {
    startKey?: string,
    limit?: number
}

export type GetGroupsRequest = {
    startKey?: string,
    limit?: number,
    startDate?: string,
    endDate?: string
}

export type RequestConfig = {
    method: string,
    url: string
}

type DateType = 'CREATED' | 'UPDATED'

export type GetMessagesRequestType = {
    startKey?: string
    limit?: number
    messageId?: string
    messageIds?: Array<string>
    groupId?: GroupId
    to?: string
    from?: string
    type?: MessageType
    statusCode?: string
    duration?: {
        dateType?: DateType
        startDate: string
        endDate: string
    }
}

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
        if (getMessageRequestType.duration?.dateType) this.dateType = getMessageRequestType.duration.dateType;
        if (getMessageRequestType.duration) this.startDate = formatISO(stringDateTransfer(getMessageRequestType.duration.startDate));
        if (getMessageRequestType.duration) this.endDate = formatISO(stringDateTransfer(getMessageRequestType.duration.endDate));
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
        startDate: string | Date
        endDate: string | Date
    }
    masterAccountId: string
}

export class GetStatisticsRequest {
    readonly startDate: string;
    readonly endDate: string;
    readonly masterAccountId: string;

    constructor(getStatisticsRequest: GetStatisticsRequestType) {
        if (getStatisticsRequest.duration) this.startDate = formatISO(stringDateTransfer(getStatisticsRequest.duration.startDate));
        if (getStatisticsRequest.duration) this.endDate = formatISO(stringDateTransfer(getStatisticsRequest.duration.endDate));
        this.masterAccountId = getStatisticsRequest.masterAccountId;
    }
}

export type FileType = 'KAKAO' | 'MMS' | 'DOCUMENT' | 'RCS'

export type FileUploadRequest = {
    file: string
    type: FileType
    name?: string
    link?: string
}

export type CreateGroupRequest = DefaultAgentType & {
    allowDuplicates: boolean
    appId?: string
}

export type GetKakaoChannelsRequestType = {
    pfId?: string
    searchId?: string
    phoneNumber?: string
    categoryCode?: string
    dateCreated?: string
    dateUpdated?: string
    startKey?: string
    limit?: number
}

export class GetKakaoChannelsRequest {
    readonly pfId?: string;
    readonly searchId?: string;
    readonly phoneNumber?: string;
    readonly categoryCode?: string;
    readonly dateCreated?: string;
    readonly dateUpdated?: string;
    readonly startKey?: string;
    readonly limit?: number;

    constructor(getKakaoChannelsRequestType: GetKakaoChannelsRequestType) {
        this.pfId = getKakaoChannelsRequestType.pfId;
        this.searchId = getKakaoChannelsRequestType.searchId;
        this.phoneNumber = getKakaoChannelsRequestType.phoneNumber;
        this.categoryCode = getKakaoChannelsRequestType.categoryCode;
        this.dateCreated = getKakaoChannelsRequestType.dateCreated;
        this.dateUpdated = getKakaoChannelsRequestType.dateUpdated;
        this.startKey = getKakaoChannelsRequestType.startKey;
        this.limit = getKakaoChannelsRequestType.limit;
    }
}

export type CreateKakaoChannelTokenRequest = {
    searchId: string
    phoneNumber: string
    categoryCode: string
}

export type CreateKakaoChannelRequest = {
    searchId: string
    phoneNumber: string
    categoryCode: string
    token: string
}

export type GetKakaoAlimtalkTemplatesRequestType = {
    name?: string
    pfId?: string
    templateId?: string
    isHidden?: boolean
    status?: string
    startKey?: string
    limit?: number
    dateCreated?: string
    dateUpdated?: string
}

export class GetKakaoAlimtalkTemplatesRequest {
    name?: string;
    pfId?: string;
    templateId?: string;
    isHidden?: boolean;
    status?: string;
    startKey?: string;
    limit?: number;
    dateCreated?: string;
    dateUpdated?: string;

    constructor(getKakaoAlimtalkTemplatesRequestType: GetKakaoAlimtalkTemplatesRequestType) {
        this.name = getKakaoAlimtalkTemplatesRequestType.name;
        this.pfId = getKakaoAlimtalkTemplatesRequestType.pfId;
        this.templateId = getKakaoAlimtalkTemplatesRequestType.templateId;
        this.isHidden = getKakaoAlimtalkTemplatesRequestType.isHidden;
        this.status = getKakaoAlimtalkTemplatesRequestType.status;
        this.startKey = getKakaoAlimtalkTemplatesRequestType.startKey;
        this.limit = getKakaoAlimtalkTemplatesRequestType.limit;
        this.dateCreated = getKakaoAlimtalkTemplatesRequestType.dateCreated;
        this.dateUpdated = getKakaoAlimtalkTemplatesRequestType.dateUpdated;
    }
}
