import Message from '../models/message';

export type DefaultAgent = {
    sdkVersion: string,
    osPlatform: string,
};

export class SingleMessageSendingRequest {
    message: Message;
    allowDuplicates: boolean;
    protected agent: DefaultAgent;

    constructor(message: Message, allowDuplicates = false) {
        this.message = message;
        this.allowDuplicates = allowDuplicates;
        this.agent = {
            sdkVersion: 'nodejs/5.0.0',
            osPlatform: process.platform,
        };
    }
}

//export class
