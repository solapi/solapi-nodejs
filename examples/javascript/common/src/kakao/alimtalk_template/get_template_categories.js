/**
 * 카카오 알림톡 템플릿 카테고리 목록 조회 예제
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService.getKakaoAlimtalkTemplateCategories().then(res => {
  for (const category of res) {
    console.log(category);
  }
});
