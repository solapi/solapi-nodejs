/**
 * 카카오 BMS 자유형 IMAGE 타입 발송 예제
 * 이미지 업로드 후 imageId를 사용하여 발송합니다.
 * 이미지 업로드 시 fileType은 반드시 'BMS'를 사용해야 합니다.
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
    // 최소 구조 단건 발송 예제 (text, imageId)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🆕 신상품이 입고되었어요!\n지금 바로 확인해보세요.',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'IMAGE',
            imageId: fileId,
          },
        },
      })
      .then(res => console.log(res));

    // 전체 필드 단건 발송 예제 (adult, imageId, imageLink, coupon)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🎊 홍길동님, VIP 고객 전용 특별 이벤트!\n\n프리미엄 회원만을 위한 시크릿 세일이 시작되었습니다.\n최대 70% 할인 혜택을 놓치지 마세요!',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'IMAGE',
            adult: false,
            imageId: fileId,
            imageLink: 'https://example.com/vip-sale',
            coupon: {
              title: '10000원 할인 쿠폰',
              description: 'VIP 고객 전용 할인 쿠폰입니다.',
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
          text: '🌸 봄 신상 컬렉션 오픈!\n\n3월 1일 오전 10시, 첫 공개됩니다.\n알림 설정하고 가장 먼저 만나보세요!',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
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
          text: '🏠 새로운 인테리어 아이디어!\n\n이번 시즌 트렌드를 확인해보세요.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
            },
          },
        },
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '👗 스타일링 꿀팁 대공개!\n\n데일리룩부터 특별한 날까지, 모든 코디를 한번에.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'IMAGE',
              imageId: fileId,
            },
          },
        },
      ])
      .then(res => console.log(res));
  });
