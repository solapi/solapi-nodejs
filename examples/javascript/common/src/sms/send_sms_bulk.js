/**
 * 카카오 알림톡(이미지 알림톡 포함, 이미지 알림톡은 별도의 추가 파라미터가 없습니다) 대량 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.createGroup().then(async groupId => {
  // 10,000건 씩 끊어서 반복하여 그룹에 메시지를 적재할 수 있음, 한 요청 당 10,000건이 가능하며 그룹 당 최대 100만 건 까지 가능
  await messageService.addMessagesToGroup(groupId, [
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    },
  ]);

  // 실제 적재된 그룹에 대한 전체 발송 접수 요청
  await messageService.sendGroup(groupId);
});
