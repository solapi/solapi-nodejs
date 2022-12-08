/**
 * 카카오 알림톡 템플릿 목록 조회 예제
 */

const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoAlimtalkTemplates(
    // 검색 조건이 있을 떄 추가
    {
      name: '템플릿 이름 입력(일부 키워드로 검색 가능)',
      channelId: '카카오 채널 ID 입력(구 pfId)',
      templateId: '알림톡 템플릿 ID 입력',
      // 숨긴 템플릿 검색, true로 했을 때만 숨긴 템플릿이 검색 됨
      isHidden: true,
      /**
       *  @type {import('solapi').GetKakaoAlimtalkTemplatesRequest.status}
       *  status 안에 포함된 4가지 사항 중 한가지 선택
       *  PENDING: 대기(검수필요)
       *  INSPECTING: 검수중
       *  APPROVED: 등록완료(검수완료)
       *  REJECTED: 반려됨
       *  */
      status: 'INSPECTING',
    },
  )
  .then(res => console.log(res));
