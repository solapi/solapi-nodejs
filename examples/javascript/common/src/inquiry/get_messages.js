/**
 * 메시지 조회 예제(문자, 알림톡 등)
 */
const solapi = require("solapi").default;
const messageService = new solapi("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getMessages({
  // 불러올 메시지 갯수 제한
  // limit: 5, // 5를 입력하면 5건이 조회됩니다, 미 입력시 20개로 지정

  // 메시지 ID로 검색
  // messageId: '메시지 ID 입력', // 메시지 ID는 대개 M4V로 시작합니다

  // 여러 메시지 ID로 검색
  /*messageIds: [
    '메시지 ID 입력' // 메시지 ID는 대개 M4V로 시작합니다
  ],*/

  // 그룹 ID로 검색
  // groupId: '그룹 ID 입력', // 그룹 ID는 대개 G4V로 시작합니다

  // 발신번호로 검색
  // from: '01012345678',

  // 수신번호로 검색
  // to: '01012345678',

  /**
   * 메시지 타입으로 검색
   * SMS: 단문 문자, LMS: 장문 문자, MMS: 사진 문자, ATA: 알림톡, CTA: 친구톡, CTI: 이미지(1장) 친구톡
   */
  // type: "SMS",

  // 날짜로 검색하는 경우
  /*duration: {
    dateType: 'CREATED', 메시지 생성 일 기준, UPDATED로 변경하면 메시지 상태 갱신일자 기준으로 조회 함
    startDate: '2022-03-01 00:00:00', // Date 객체로도 요청 가능
    endDate: '2022-03-31 23:59:59' // Date 객체로도 요청 가능
  }*/
}).then(res => console.log(res));

/**
 * 페이징 예제
 * */
messageService.getMessages().then(res => {

  messageService.getMessages({
    // startKey 부분에 nextKey를 입력할 경우 초기 20건 다음의 데이터를 표시하게 됩니다.
    startKey: res.nextKey
  }).then(res2 => {
    console.log(res2);
  });

});
