import {KakaoButton} from './kakaoButton';

export default class KakaoOption {
    pfId: string;
    templateId?: string;
    variables?: Record<string, string>;
    disableSms = false;
    adFlag = false;
    buttons?: Array<KakaoButton>;
    imageId?: string;

    constructor(pfId: string, templateId: string, variables: Record<string, string>, disableSms: boolean, adFlag: boolean, buttons: Array<KakaoButton>, imageId: string) {
        this.pfId = pfId;
        this.templateId = templateId;
        this.variables = variables;
        this.disableSms = disableSms;
        this.adFlag = adFlag;
        this.buttons = buttons;
        this.imageId = imageId;
    }
}
