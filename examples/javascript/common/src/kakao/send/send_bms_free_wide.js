/**
 * 카카오 BMS 자유형 WIDE 타입 발송 예제
 * 와이드 이미지 형식으로, 기본 IMAGE 타입보다 넓은 이미지를 표시합니다.
 * 이미지 업로드 시 fileType은 반드시 'BMS_WIDE'를 사용해야 합니다.
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

// WIDE 타입은 반드시 'BMS_WIDE' fileType으로 업로드해야 합니다
messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'BMS_WIDE')
  .then(res => res.fileId)
  .then(fileId => {
    // 최소 구조 단건 발송 예제 (text, imageId)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🎬 이번 주 신작 영화 개봉!\n\n지금 예매하고 팝콘 세트 할인받으세요.',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'WIDE',
            imageId: fileId,
          },
        },
      })
      .then(res => console.log(res));

    // 전체 필드 단건 발송 예제 (adult, imageId, buttons, coupon)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '✈️ 홍길동님, 여행 준비 되셨나요?\n\n얼리버드 예약 시 배송비 무료 혜택!\n여행용품 베스트 아이템을 만나보세요.',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'WIDE',
            adult: false,
            imageId: fileId,
            buttons: [
              {
                linkType: 'WL',
                name: '여행용품 보기',
                linkMobile: 'https://example.com',
                linkPc: 'https://example.com',
              },
              {
                linkType: 'AL',
                name: '앱에서 열기',
                linkMobile: 'https://example.com',
                linkAndroid: 'examplescheme://path',
                linkIos: 'examplescheme://path',
              },
            ],
            coupon: {
              title: '배송비 할인 쿠폰',
              description: '얼리버드 고객 전용 무료배송 쿠폰입니다.',
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
          text: '🌅 제주도 선셋 투어 오픈!\n\n잊지 못할 추억을 만들어드려요.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'WIDE',
              imageId: fileId,
            },
          },
        },
        {scheduledDate: '2025-12-08 00:00:00'},
      )
      .then(res => console.log(res));
  });
