/**
 * 080 수신 거부 목록 조회
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getBlacks({
  // 차단 당한 발신번호를 검색하는 경우
  // senderNumber: '029302266',

  // 날짜로 검색하는 경우
  // startDate: '2022-12-01 00:00:00', // Date 객체로도 요청 가능
  // endDate: '2022-12-31 23:59:59' // Date 객체로도 요청 가능
}).then(res => {
  // 목록
  console.log('#page1', res.blackList);

  // 응답에 nextKeyr가 있을 경우 다음 페이지도 조회 가능
  messageService.getBlacks({
    startKey: res.nextKey
  }).then(res => {
    console.log('#page2', res.blackList);
  });
});
