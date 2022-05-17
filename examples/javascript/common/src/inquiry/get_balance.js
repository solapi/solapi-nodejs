/**
 * 잔액 조회 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getBalance().then(res => console.log(res));
