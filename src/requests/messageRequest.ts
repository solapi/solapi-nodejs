import Message from '../models/message';

export type DefaultAgentType = {
    sdkVersion: string,
    osPlatform: string,
};

export const defaultAgent: DefaultAgentType = {
    sdkVersion: 'nodejs/5.0.0',
    osPlatform: `${process.platform} | ${process.version}`,
}

abstract class DefaultMessageRequest {
    allowDuplicates: boolean;
    appId: string | null;
    protected agent: DefaultAgentType;

    protected constructor() {
        this.agent = defaultAgent;
        this.appId = null;
        this.allowDuplicates = false;
    }
}

export class SingleMessageSendingRequest extends DefaultMessageRequest {
    message: Message;

    constructor(message: Message, allowDuplicates?: boolean, appId?: string) {
        super();
        this.message = message;
        if (typeof allowDuplicates === 'boolean') {
            this.allowDuplicates = allowDuplicates
        }
        if (appId) {
            this.appId = appId;
        }
    }
}

export class MultipleMessageSendingRequest extends DefaultMessageRequest {
    messages: Array<Message>

    constructor(messages: Array<Message>, allowDuplicates?: boolean, appId?: string) {
        super();
        this.messages = messages;
        if (typeof allowDuplicates === 'boolean') {
            this.allowDuplicates = allowDuplicates
        }
        if (appId) {
            this.appId = appId;
        }
    }
}

export type GetGroupMessagesRequest = {
    startKey?: string,
    limit?: number
}
