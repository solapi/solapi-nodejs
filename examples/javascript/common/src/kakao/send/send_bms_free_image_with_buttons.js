/**
 * 버튼을 포함한 카카오 BMS 자유형 IMAGE 타입 발송 예제
 * 이미지 업로드 후 imageId를 사용하여 버튼과 함께 발송합니다.
 * BMS 자유형 버튼 타입: WL(웹링크), AL(앱링크), AC(채널추가), BK(봇키워드), MD(상담요청), BC(상담톡전환), BT(챗봇전환), BF(비즈니스폼)
 * targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const path = require('path');
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'KAKAO')
  .then(res => res.fileId)
  .then(fileId => {
    // 단일 발송 예제
    messageService
      .sendOne({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I', // I: 전체, M/N: 인허가 채널만
            chatBubbleType: 'IMAGE',
            imageId: fileId,
            buttons: [
              {
                linkType: 'WL', // 웹링크
                name: '버튼 이름',
                linkMobile: 'https://m.example.com',
                linkPc: 'https://example.com', // 생략 가능
              },
              {
                linkType: 'AL', // 앱링크
                name: '앱 실행',
                linkAndroid: 'examplescheme://',
                linkIos: 'examplescheme://',
              },
              {
                linkType: 'BK', // 봇키워드
                name: '봇키워드',
                chatExtra: '추가 데이터', // 선택
              },
              {
                linkType: 'MD', // 상담요청하기
                name: '상담요청하기',
                chatExtra: '추가 데이터', // 선택
              },
              {
                linkType: 'BT', // 챗봇 문의
                name: '챗봇 문의',
                chatExtra: '추가 데이터', // 선택
              },
            ],
          },
        },
      })
      .then(res => console.log(res));

    // 단일 예약 발송 예제
    // 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
    messageService
      .sendOneFuture(
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
              buttons: [
                {
                  linkType: 'WL',
                  name: '버튼 이름',
                  linkMobile: 'https://m.example.com',
                },
              ],
            },
          },
        },
        '2025-12-08 00:00:00',
      )
      .then(res => console.log(res));

    // 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    messageService
      .send([
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
              buttons: [
                {
                  linkType: 'WL',
                  name: '버튼 이름',
                  linkMobile: 'https://m.example.com',
                },
              ],
            },
          },
        },
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '2,000byte 이내의 메시지 입력',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
              buttons: [
                {
                  linkType: 'WL',
                  name: '버튼 이름',
                  linkMobile: 'https://m.example.com',
                },
              ],
            },
          },
        },
        // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      ])
      .then(res => console.log(res));
  });
