/**
 * 버튼을 포함한 카카오 BMS 자유형 IMAGE 타입 발송 예제
 * 이미지 업로드 후 imageId를 사용하여 버튼과 함께 발송합니다.
 * 이미지 업로드 시 fileType은 반드시 'BMS'를 사용해야 합니다.
 * BMS 자유형 버튼 타입: WL(웹링크), AL(앱링크), AC(채널추가), BK(봇키워드), MD(상담요청), BC(상담톡전환), BT(챗봇전환), BF(비즈니스폼)
 * 쿠폰 제목 형식: "N원 할인 쿠폰", "N% 할인 쿠폰", "배송비 할인 쿠폰", "OOO 무료 쿠폰", "OOO UP 쿠폰"
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

// IMAGE 타입은 반드시 'BMS' fileType으로 업로드해야 합니다
messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'BMS')
  .then(res => res.fileId)
  .then(fileId => {
    // 전체 필드 단건 발송 예제 (adult, imageId, imageLink, buttons, coupon)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🎁 연말 감사 이벤트!\n\n한 해 동안 함께해주셔서 감사합니다.\n특별한 혜택으로 보답드려요!',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'IMAGE',
            adult: false,
            imageId: fileId,
            imageLink: 'https://example.com/year-end-event',
            buttons: [
              {
                linkType: 'WL',
                name: '이벤트 참여하기',
                linkMobile: 'https://example.com',
                linkPc: 'https://example.com',
              },
              {
                linkType: 'AL',
                name: '앱에서 보기',
                linkMobile: 'https://example.com',
                linkAndroid: 'examplescheme://path',
                linkIos: 'examplescheme://path',
              },
              {
                linkType: 'AC',
                name: '채널 추가',
              },
              {
                linkType: 'BK',
                name: '이벤트 문의',
                chatExtra: 'event_inquiry',
              },
            ],
            coupon: {
              title: '10000원 할인 쿠폰',
              description: '연말 감사 할인 쿠폰입니다.',
              linkMobile: 'https://example.com/coupon',
            },
          },
        },
      })
      .then(res => console.log(res));

    // 단건 예약 발송 예제
    messageService
      .send(
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '☀️ 이번 주 날씨 좋은 날, 나들이 어때요?\n\n피크닉 용품 최대 40% 할인 중!',
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
                  name: '피크닉 용품 보기',
                  linkMobile: 'https://m.example.com/picnic',
                },
              ],
            },
          },
        },
        {scheduledDate: '2025-12-08 00:00:00'},
      )
      .then(res => console.log(res));

    // 다건 발송 예제
    messageService
      .send([
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '🍳 오늘의 레시피 추천!\n\n초간단 15분 브런치 만들기',
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
                  name: '레시피 보기',
                  linkMobile: 'https://m.example.com/recipe',
                },
              ],
            },
          },
        },
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '🏋️ 이번 달 운동 목표 달성!\n\n축하드려요! 다음 목표도 함께 도전해요.',
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
                  name: '새 목표 설정',
                  linkMobile: 'https://m.example.com/goal',
                },
              ],
            },
          },
        },
      ])
      .then(res => console.log(res));
  });
