/**
 * 카카오 BMS 자유형 TEXT 타입 발송 예제
 * 텍스트만 포함하는 가장 기본적인 BMS 자유형 메시지입니다.
 * targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 최소 구조 단건 발송 예제 (text만)
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '안녕하세요, 홍길동님! 오늘도 좋은 하루 되세요 🌞',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I', // I: 전체, M/N: 인허가 채널만
        chatBubbleType: 'TEXT',
      },
    },
  })
  .then(res => console.log(res));

// 전체 필드 단건 발송 예제 (adult, coupon 포함)
// 쿠폰 제목 형식: "N원 할인 쿠폰", "N% 할인 쿠폰", "배송비 할인 쿠폰", "OOO 무료 쿠폰", "OOO UP 쿠폰"
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '🎉 홍길동님, 특별 할인 쿠폰이 도착했어요!\n\n지금 바로 사용하시면 10,000원 할인 혜택을 받으실 수 있습니다.\n유효기간: 2025년 12월 31일까지',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I',
        chatBubbleType: 'TEXT',
        adult: false,
        coupon: {
          title: '10000원 할인 쿠폰',
          description: '신규 회원 전용 웰컴 쿠폰입니다.',
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
      text: '📢 오늘 저녁 8시, 깜짝 타임세일이 시작됩니다!\n최대 50% 할인 혜택을 놓치지 마세요.',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
    {scheduledDate: '2025-12-08 00:00:00'},
  )
  .then(res => console.log(res));

// 다건 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '📦 주문하신 상품이 발송되었습니다!\n배송 조회: https://example.com/tracking',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '✅ 회원가입이 완료되었습니다!\n지금 바로 다양한 혜택을 확인해보세요.',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
  ])
  .then(res => console.log(res));

// 다건 예약 발송 예제
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🔔 내일 오전 10시에 예약하신 상담이 진행됩니다.\n장소: 강남점 3층',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'TEXT',
          },
        },
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '💝 생일 축하드립니다!\n특별한 생일 혜택이 준비되어 있어요.',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'TEXT',
          },
        },
      },
    ],
    {scheduledDate: '2025-12-08 00:00:00'},
  )
  .then(res => console.log(res));
