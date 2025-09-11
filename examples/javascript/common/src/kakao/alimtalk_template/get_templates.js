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
    /*{
      limit: 5, // 한 번 요청당 조회할 건 수 입력, 기본값은 20
      startKey: '페이지네이션 조회 키',
      name: '템플릿 이름 입력(일부 키워드로 검색 가능)',
      // 템플릿 이름 검색을 eq, ne 등이 포함된  object로 더 자세하게 검색할 수 있습니다!
      /!*name: {
        eq: '', // 해당 값과 완벽히 일치하는 템플릿만을 검색
        ne: '', // 해당 값과 불일치하는 템플릿만을 검색
      },*!/
      channelId: '카카오 채널 ID 입력(구 pfId)',
      templateId: '알림톡 템플릿 ID 입력',
      isHidden: true, // 숨긴 템플릿 검색, true로 했을 때만 숨긴 템플릿이 검색 됨
      /!**
       *  @type {import('solapi').GetKakaoAlimtalkTemplatesRequest.status}
       *  status 안에 포함된 4가지 사항 중 한가지 선택
       *  PENDING: 대기(검수필요)
       *  INSPECTING: 검수중
       *  APPROVED: 등록완료(검수완료)
       *  REJECTED: 반려됨
       *  *!/
      status: 'INSPECTING',
      startDate: '',
      endDate: '',
    },*/
  )
  .then(res => console.log(res));
