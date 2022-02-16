import {KakaoButton} from './kakaoButton';

export default class KakaoOption {
    pfId!: string;
    templateId?: string;
    variables?: Map<string, string>;
    disableSms = false;
    adFlag = false;
    buttons?: Array<KakaoButton>;

    constructor(pfId: string, templateId: string, variables: Map<string, string>, disableSms: boolean, adFlag: boolean, buttons: Array<KakaoButton>) {
        this.pfId = pfId;
        this.templateId = templateId;
        this.variables = variables;
        this.disableSms = disableSms;
        this.adFlag = adFlag;
        this.buttons = buttons;
    }
}
