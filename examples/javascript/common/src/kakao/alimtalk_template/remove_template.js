/**
 * 카카오 알림톡 템플릿 삭제 예제
 * 알림톡 템플릿을 수정할 때에는 반드시 대기 상태에서만 수정할 수 있습니다.
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .removeKakaoAlimtalkTemplate('삭제할 알림톡 템플릿 ID')
  .then(res => console.log(res));
