import Message, {MessageType} from '../models/message';
import {App, CommonCashResponse, Count, CountForCharge, GroupId, Log} from '../types/commonTypes';

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

export type GroupMessageResponse = {
    count: Count,
    countForCharge: CountForCharge,
    balance: CommonCashResponse,
    point: CommonCashResponse,
    app: App,
    log: Log,
    status: string,
    allowDuplicates: boolean,
    isRefunded: boolean,
    accountId: string,
    masterAccountId: string | null,
    apiVersion: string,
    groupId: string,
    price: object,
    dateCreated: Date,
    dateUpdated: Date
}

export type AddMessageResult = {
    to: string,
    from: string,
    type: string,
    country: string,
    messageId: string,
    statusCode: string,
    statusMessage: string,
    accountId: string
}

export type AddMessageResponse = {
    errorCount: string,
    resultList: Array<AddMessageResult>
}

export type GetGroupMessagesResponse = {
    startKey: string | null,
    limit: number,
    messageList: Record<string, Message>
}

export type RemoveGroupMessagesResponse = {
    groupId: GroupId,
    errorCount: number,
    resultList: Array<{
        messageId: string,
        resultCode: string
    }>
}
