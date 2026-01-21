/**
 * 버튼을 포함한 카카오 BMS 자유형 TEXT 타입 발송 예제
 * BMS 자유형 버튼 타입: WL(웹링크), AL(앱링크), AC(채널추가), BK(봇키워드), MD(상담요청), BC(상담톡전환), BT(챗봇전환), BF(비즈니스폼)
 * 쿠폰 제목 형식: "N원 할인 쿠폰", "N% 할인 쿠폰", "배송비 할인 쿠폰", "OOO 무료 쿠폰", "OOO UP 쿠폰"
 * targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 전체 필드 단건 발송 예제 (adult, buttons, coupon 포함)
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '🛍️ 홍길동님을 위한 맞춤 추천!\n\n이번 주 베스트 상품을 확인해보세요.\n지금 구매 시 10% 추가 할인!',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I',
        chatBubbleType: 'TEXT',
        adult: false,
        buttons: [
          {
            linkType: 'WL',
            name: '베스트 상품 보기',
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
          {
            linkType: 'AC',
            name: '채널 추가',
          },
          {
            linkType: 'BK',
            name: '1:1 문의하기',
            chatExtra: 'inquiry',
          },
        ],
        coupon: {
          title: '10% 할인 쿠폰',
          description: '이번 주 한정 특별 할인 쿠폰입니다.',
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
      text: '⏰ 장바구니에 담은 상품이 기다리고 있어요!\n\n지금 결제하시면 무료 배송 혜택을 드려요.',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          buttons: [
            {
              linkType: 'WL',
              name: '장바구니 확인',
              linkMobile: 'https://m.example.com/cart',
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
      text: '💳 결제가 완료되었습니다!\n\n주문번호: ORD-2025-001234\n결제금액: 45,000원',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          buttons: [
            {
              linkType: 'WL',
              name: '주문 상세 보기',
              linkMobile: 'https://m.example.com/order',
            },
          ],
        },
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '🏃 오늘의 운동 리포트가 도착했어요!\n\n총 걸음수: 8,542걸음\n소모 칼로리: 320kcal',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          buttons: [
            {
              linkType: 'WL',
              name: '상세 리포트 보기',
              linkMobile: 'https://m.example.com/report',
            },
          ],
        },
      },
    },
  ])
  .then(res => console.log(res));
