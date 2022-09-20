export type KakaoChannelCategory = {
    code: string;
    name: string;
}

export type KakaoChannel = {
    channelId: string;
    searchId: string;
    accountId: string;
    phoneNumber: string;
    sharedAccountIds: Array<string>;
    dateCreated: string;
    dateUpdated: string;
}
