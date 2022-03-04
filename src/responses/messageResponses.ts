import Message, {MessageType} from '../models/message';
import {
    App,
    CommonCashResponse,
    Count,
    CountForCharge,
    Group,
    GroupId,
    Log,
    MessageTypeRecord
} from '../types/commonTypes';

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
    count: Count
    countForCharge: CountForCharge
    balance: CommonCashResponse
    point: CommonCashResponse
    app: App
    log: Log
    status: string
    allowDuplicates: boolean
    isRefunded: boolean
    accountId: string
    masterAccountId: string | null
    apiVersion: string
    groupId: string
    price: object
    dateCreated: string
    dateUpdated: string
}

export type AddMessageResult = {
    to: string
    from: string
    type: string
    country: string
    messageId: string
    statusCode: string
    statusMessage: string
    accountId: string
}

export type AddMessageResponse = {
    errorCount: string
    resultList: Array<AddMessageResult>
}

export type GetMessagesResponse = {
    startKey: string | null
    nextKey: string | null
    limit: number
    messageList: Record<string, Message>
}

export type RemoveGroupMessagesResponse = {
    groupId: GroupId
    errorCount: number
    resultList: Array<{
        messageId: string
        resultCode: string
    }>
}

export type GetGroupsResponse = {
    startKey: string | null | undefined,
    limit: number,
    nextKey: string | null | undefined,
    groupList: Record<GroupId, Group>
}

type StatisticsPeriodResult = {
    total: number
    sms: number
    lms: number
    mms: number
    ata: number
    cta: number
    cti: number
    nsa: number
    rcs_sms: number
    rcs_lms: number
    rcs_mms: number
    rcs_tpl: number
}

export type GetStatisticsResponse = {
    balance: number
    point: number
    monthlyBalanceAvg: number
    monthlyPointAvg: number
    monthPeriod: Array<{
        date: string
        balance: number
        balanceAvg: number
        point: number
        pointAvg: number
        dayPeriod: Array<{
            _id: string
            month: string
            balance: number
            point: number
            statusCode: Record<string, MessageTypeRecord>
            refund: {
                balance: number
                point: number
            }
            total: StatisticsPeriodResult
            successed: StatisticsPeriodResult
            failed: StatisticsPeriodResult
        }>
        refund: {
            balance: number
            balanceAvg: number
            point: number
            pointAvg: number
        }
        total: StatisticsPeriodResult
        successed: StatisticsPeriodResult
        failed: StatisticsPeriodResult
    }>
    total: StatisticsPeriodResult
    successed: StatisticsPeriodResult
    failed: StatisticsPeriodResult
    dailyBalanceAvg: number
    dailyPointAvg: number
    dailyTotalCountAvg: number
    dailyFailedCountAvg: number
    dailySuccessedCountAvg: number
}

export type GetBalanceResponse = {
    balance: number
    point: number
}

export type FileUploadResponse = {
    fileId: string
    type: string
    link: string | null | undefined
}
