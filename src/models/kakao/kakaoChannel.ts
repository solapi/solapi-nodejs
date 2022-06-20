export class KakaoChannelCategory {
    code: string;
    name: string;
}

export class KakaoChannel {
    pfId: string;
    searchId: string;
    accountId: string;
    phoneNumber: string;
    sharedAccountIds: Array<string>;
    dateCreated: string;
    dateUpdated: string;
}
