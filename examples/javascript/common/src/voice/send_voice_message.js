/**
 * 음성 메시지 발송 예제
 * 음성 메시지에 대한 자세한 내용은 아래 링크를 참고해주세요.
 * @see https://developers.solapi.com/references/voice
 * 문서상 DTMF는 유선 전화등에서 들을 수 있는 다이얼 신호들을 뜻합니다.
 * @see https://en.wikipedia.org/wiki/DTMF_signaling
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.send({
  to: '수신번호',
  from: '발신번호',
  text: '음성 메시지 테스트입니다, 실제 수신자에게 들리는 내용입니다.',
  voiceOptions: {
    voiceType: 'FEMALE', // 필수값, MALE 혹은 FEMALE만 선택 가능합니다
    // headerMessage: '보이스 메시지 테스트', // 메시지 시작에 나오는 머릿말, 최대 135자까지 가능합니다.
    // tailMessage: '보이스 메시지 테스트', // 통화가 끝나고 나오는 꼬릿말, 상담원 연결 시 나오지 않습니다, 머리말(headerMessage)이 있어야 적용됩니다.
    // replyRange: 1, // 수신자가 누를 수 있는 다이얼 값의 범위, 1~9까지 가능하며 counselorNumber와 함께 사용할 수 없습니다.
    // counselorNumber: '상담번호, 예) 029302266', // 수신자가 0번을 눌렀을 때 연결되는 상담번호, replyRange와 함께 사용할 수 없습니다.
  },
});
