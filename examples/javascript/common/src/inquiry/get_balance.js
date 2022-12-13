/**
 * 잔액 조회 예제
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getBalance().then(res => {
  // 잔액 조회
  console.log(res.balance);

  // 포인트 조회
  console.log(res.point);
});
