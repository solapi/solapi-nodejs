/**
 * 카카오 알림톡 템플릿 조회 예제
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoAlimtalkTemplate('조회할 알림톡 template ID')
  .then(res => console.log(res));
