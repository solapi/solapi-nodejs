/**
 * 카카오 BMS 자유형 COMMERCE 타입 발송 예제
 * 커머스(상품) 메시지로, 상품 이미지와 가격 정보, 쿠폰을 포함합니다.
 * 이미지 업로드 시 fileType은 'BMS'를 사용해야 합니다. (2:1 비율 이미지 권장)
 * COMMERCE 타입은 buttons가 필수입니다 (최소 1개).
 * 가격 정보(regularPrice, discountPrice, discountRate, discountFixed)는 숫자 타입입니다.
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

// COMMERCE 타입은 'BMS' fileType으로 업로드해야 합니다 (2:1 비율 이미지 권장)
messageService
  .uploadFile(path.join(__dirname, '../../images/example-2to1.jpg'), 'BMS')
  .then(res => res.fileId)
  .then(imageId => {
    // 최소 구조 단건 발송 예제 (imageId, commerce title만, buttons 1개)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'COMMERCE',
            imageId: imageId,
            commerce: {
              title: '프리미엄 무선 이어폰',
              regularPrice: 89000,
            },
            buttons: [
              {
                linkType: 'WL',
                name: '상품 보기',
                linkMobile: 'https://example.com/product',
              },
            ],
          },
        },
      })
      .then(res => console.log(res));

    // 전체 필드 단건 발송 예제 (adult, additionalContent, imageId, commerce 전체, buttons, coupon)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'COMMERCE',
            adult: false,
            additionalContent: '🚀 오늘 주문 시 내일 도착! 무료배송',
            imageId: imageId,
            commerce: {
              title: '스마트 공기청정기 2024 신형',
              regularPrice: 299000,
              discountPrice: 209000,
              discountRate: 30,
            },
            buttons: [
              {
                linkType: 'WL',
                name: '지금 구매하기',
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
            ],
            coupon: {
              title: '포인트 UP 쿠폰',
              description: '구매 시 2배 적립 쿠폰입니다.',
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
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'COMMERCE',
              imageId: imageId,
              commerce: {
                title: '겨울 패딩 점퍼 - 한정판',
                regularPrice: 189000,
                discountPrice: 149000,
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '바로 구매',
                  linkMobile: 'https://example.com/buy',
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
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'COMMERCE',
              imageId: imageId,
              commerce: {
                title: '유기농 그래놀라 선물세트',
                regularPrice: 45000,
                discountPrice: 38000,
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '선물하기',
                  linkMobile: 'https://example.com/gift',
                },
              ],
            },
          },
        },
      ])
      .then(res => console.log(res));
  });
