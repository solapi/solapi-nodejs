/**
 * 카카오 비즈니스 채널 목록 조회 예제
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .getKakaoChannels(
    // 조회할 조건이 있을 때 추가해주시면 됩니다!
    {
      channelId: '조회할 채널 ID 입력',
      searchId: '조회할 검색용 아이디 입력',

      // 조회할 건 수 입력, 미입력 시 기본 건 수는 20건 입니다.
      limit: 1,

      startKey:
        '조회할 페이지네이션 키 입력, 보통 채널 조회 시 응답받는 nextKey 항목으로 넣어보실 수 있습니다.',

      // 생성일자로 검색
      dateCreated: {
        // 검색 조건 설명은 링크를 참조해주세요!
        // https://docs.solapi.com/documents/references/#operator
        gte: '2022-09-01',
        lte: '2022-09-30',
      },

      // 수정일자로 검색
      dateUpdated: {
        // 검색 조건 설명은 링크를 참조해주세요!
        // https://docs.solapi.com/documents/references/#operator
        gte: '2022-09-01',
        lte: '2022-09-30',
      },
    },
  )
  .then(res => console.log(res));
