import {MessageType} from '../models/message';

export type SingleMessageSentResponse = {
    groupId: string;
    to: string;
    from: string;
    type: MessageType,
    statusMessage: string;
    country: string;
    messageId: string;
    statusCode: string;
    accountId: string;
}
