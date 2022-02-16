import Message from './models/message';
import {SingleMessageSendingRequest} from './requests/messageRequest';
import defaultFetcher from './lib/defaultFetcher';
import {SingleMessageSentResponse} from './responses/messageResponse';

export default class MessageService {
    private readonly baseUrl = 'https://api.solapi.com';
    private readonly apiKey: string;
    private readonly apiSecret: string;

    constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    async sendOne(message: Message): Promise<SingleMessageSentResponse> {
        const parameter = new SingleMessageSendingRequest(message);
        const authInfo = {
            apiKey: this.apiKey,
            apiSecret: this.apiSecret
        };
        const requestConfig = {
            method: 'POST',
            url: `${this.baseUrl}/messages/v4/send`
        }
        return await defaultFetcher<SingleMessageSendingRequest, SingleMessageSentResponse>(authInfo, requestConfig, parameter);
    }
}
