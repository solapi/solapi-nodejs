/**
 * 잔액 조회 예제
 */
const solapi = require("solapi").default;
const messageService = new solapi("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getBalance().then(res => console.log(res));
