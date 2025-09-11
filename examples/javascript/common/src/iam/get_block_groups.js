/**
 * 080 수신 거부 목록 조회
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getBlockGroups({
    // 해당 그룹이 켜져있는지 아닌지 확인하고 싶을 경우
    // status: 'ACTIVE' // 'ACTIVE' 혹은 'INACTIVE',
    // 해당 그룹의 대한 이름을 검색해보고 싶을 경우
    // name: '070번호그룹' (부분 검색 가능)
  })
  .then(res => {
    // 목록
    console.log('#page1', res.blockGroups);

    // 응답에 nextKey가 있을 경우 다음 페이지도 조회 가능
    messageService
      .getBlockGroups({
        startKey: res.nextKey,
      })
      .then(res => {
        console.log('#page2', res.blockGroups);
      });
  });
