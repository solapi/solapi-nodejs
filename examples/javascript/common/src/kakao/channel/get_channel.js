/**
 * 카카오 비즈니스 채널 조회 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getKakaoChannel('조회할 카카오 채널 ID 입력')
    .then(res => console.log(res));