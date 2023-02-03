/**
 * 080 수신 거부 목록 조회
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getBlockNumbers({
  // 수신 차단한 수신번호를 검색해보고 싶을 경우
  // phoneNumber: '01000000000',

  // 차단할 때 남긴 메모를 검색해보고 싶을 경우
  // memo: '이벤트 발송' (부분 검색 가능)
}).then(res => {
  // 목록
  console.log('#page1', res.blockNumbers);

  // 응답에 nextKey가 있을 경우 다음 페이지도 조회 가능
  messageService.getBlockNumbers({
    startKey: res.nextKey
  }).then(res => {
    console.log('#page2', res.blockNumbers);
  });
});
