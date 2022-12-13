/**
 * 카카오 알림톡 템플릿 검수요청 예제
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 템플릿 검수 요청, 반드시 대기 상태의 템플릿만 검수 요청할 수 있습니다.
messageService
  .requestInspectionKakaoAlimtalkTemplate('검수할 알림톡 템플릿 ID')
  .then(res => console.log(res));
