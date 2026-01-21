/**
 * 카카오 BMS 자유형 CAROUSEL_FEED 타입 발송 예제
 * 캐러셀 피드 형식으로, 여러 카드를 좌우로 슬라이드하는 구조입니다.
 * 이미지 업로드 시 fileType은 'BMS_CAROUSEL_FEED_LIST'를 사용해야 합니다. (2:1 비율 이미지 필수)
 * head 없이 2-6개 아이템, head 포함 시 1-5개 아이템 가능합니다.
 * 캐러셀 피드 버튼은 WL, AL 타입만 지원합니다.
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

// CAROUSEL_FEED 타입은 'BMS_CAROUSEL_FEED_LIST' fileType으로 업로드해야 합니다 (2:1 비율 이미지 필수)
messageService
  .uploadFile(
    path.join(__dirname, '../../images/example-2to1.jpg'),
    'BMS_CAROUSEL_FEED_LIST',
  )
  .then(res => res.fileId)
  .then(imageId => {
    // 최소 구조 단건 발송 예제 (carousel.list 2개)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'CAROUSEL_FEED',
            carousel: {
              list: [
                {
                  header: '🍳 오늘의 브런치 레시피',
                  content:
                    '15분 만에 완성하는 아보카도 토스트! 간단하지만 영양 만점이에요.',
                  imageId: imageId,
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '레시피 보기',
                      linkMobile: 'https://example.com',
                      linkPc: 'https://example.com',
                    },
                  ],
                },
                {
                  header: '☕ 홈카페 꿀팁',
                  content: '집에서 바리스타처럼! 라떼 아트 도전해보세요.',
                  imageId: imageId,
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '영상 보기',
                      linkMobile: 'https://example.com',
                      linkPc: 'https://example.com',
                    },
                  ],
                },
              ],
            },
          },
        },
      })
      .then(res => console.log(res));

    // 전체 필드 단건 발송 예제 (adult, carousel head/list 전체/tail)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'CAROUSEL_FEED',
            adult: false,
            carousel: {
              list: [
                {
                  header: '🏃 마라톤 완주 도전!',
                  content:
                    '첫 마라톤 완주를 목표로 8주 트레이닝 프로그램을 시작해보세요.',
                  imageId: imageId,
                  imageLink: 'https://example.com/marathon',
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '프로그램 신청',
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
                    title: '10% 할인 쿠폰',
                    description: '첫 등록 고객 전용 할인 쿠폰입니다.',
                    linkMobile: 'https://example.com/coupon',
                  },
                },
                {
                  header: '🧘 요가 입문 클래스',
                  content:
                    '초보자를 위한 기초 요가 동작을 배워보세요. 유연성과 마음의 평화를 함께!',
                  imageId: imageId,
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '클래스 보기',
                      linkMobile: 'https://example.com',
                      linkPc: 'https://example.com',
                    },
                  ],
                },
                {
                  header: '💪 홈트레이닝 루틴',
                  content: '장비 없이도 OK! 집에서 하는 30분 전신 운동 루틴.',
                  imageId: imageId,
                  buttons: [
                    {
                      linkType: 'AL',
                      name: '영상 시청',
                      linkMobile: 'https://example.com',
                      linkAndroid: 'examplescheme://path',
                      linkIos: 'examplescheme://path',
                    },
                  ],
                },
              ],
              tail: {
                linkMobile: 'https://example.com/more',
                linkPc: 'https://example.com/more',
              },
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
              chatBubbleType: 'CAROUSEL_FEED',
              carousel: {
                list: [
                  {
                    header: '🎄 크리스마스 특별 이벤트',
                    content: '연말 맞이 특별 할인! 인기 상품 최대 50% OFF',
                    imageId: imageId,
                    buttons: [
                      {
                        linkType: 'WL',
                        name: '이벤트 참여',
                        linkMobile: 'https://example.com/christmas',
                      },
                    ],
                  },
                  {
                    header: '🎁 선물 포장 무료',
                    content:
                      '소중한 분께 마음을 전하세요. 고급 선물 포장 무료!',
                    imageId: imageId,
                    buttons: [
                      {
                        linkType: 'WL',
                        name: '선물하기',
                        linkMobile: 'https://example.com/gift',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        {scheduledDate: '2025-12-08 00:00:00'},
      )
      .then(res => console.log(res));
  });
