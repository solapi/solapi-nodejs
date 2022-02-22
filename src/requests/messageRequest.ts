import Message from '../models/message';

export type DefaultAgentType = {
    sdkVersion: string,
    osPlatform: string,
};

export const defaultAgent: DefaultAgentType = {
    sdkVersion: 'nodejs/5.0.0',
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
