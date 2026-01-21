/**
 * 카카오 BMS 자유형 CAROUSEL_COMMERCE 타입 발송 예제
 * 캐러셀 커머스 형식으로, 여러 상품을 슬라이드로 보여주는 구조입니다.
 * 이미지 업로드 시 fileType은 'BMS_CAROUSEL_COMMERCE_LIST'를 사용해야 합니다. (2:1 비율 이미지 필수)
 * head + list(상품카드들) + tail 구조입니다.
 * head 없이 2-6개 아이템, head 포함 시 1-5개 아이템 가능합니다.
 * 가격 정보(regularPrice, discountPrice, discountRate, discountFixed)는 숫자 타입입니다.
 * 캐러셀 커머스 버튼은 WL, AL 타입만 지원합니다.
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

// CAROUSEL_COMMERCE 타입은 'BMS_CAROUSEL_COMMERCE_LIST' fileType으로 업로드해야 합니다 (2:1 비율 이미지 필수)
messageService
  .uploadFile(
    path.join(__dirname, '../../images/example-2to1.jpg'),
    'BMS_CAROUSEL_COMMERCE_LIST',
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
            chatBubbleType: 'CAROUSEL_COMMERCE',
            carousel: {
              list: [
                {
                  imageId: imageId,
                  commerce: {
                    title: '프리미엄 블루투스 스피커',
                    regularPrice: 129000,
                    discountPrice: 99000,
                    discountRate: 23,
                  },
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '구매하기',
                      linkMobile: 'https://example.com',
                      linkPc: 'https://example.com',
                    },
                  ],
                },
                {
                  imageId: imageId,
                  commerce: {
                    title: '노이즈캔슬링 헤드폰',
                    regularPrice: 249000,
                    discountPrice: 199000,
                    discountFixed: 50000,
                  },
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '구매하기',
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

    // 전체 필드 단건 발송 예제 (adult, additionalContent, carousel head/list 전체/tail)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'CAROUSEL_COMMERCE',
            adult: false,
            additionalContent: '🔥 이번 주 한정 특가!',
            carousel: {
              head: {
                header: '홍길동님을 위한 추천',
                content: '최근 관심 상품과 비슷한 아이템을 모았어요!',
                imageId: imageId,
                linkMobile: 'https://example.com/recommend',
              },
              list: [
                {
                  imageId: imageId,
                  commerce: {
                    title: '에어프라이어 대용량 5.5L',
                    regularPrice: 159000,
                    discountPrice: 119000,
                    discountRate: 25,
                  },
                  additionalContent: '⚡ 무료배송',
                  imageLink: 'https://example.com/airfryer',
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '지금 구매',
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
                    title: '10000원 할인 쿠폰',
                    description: '첫 구매 고객 전용 쿠폰입니다.',
                    linkMobile: 'https://example.com/coupon',
                  },
                },
                {
                  imageId: imageId,
                  commerce: {
                    title: '스마트 로봇청소기 프로',
                    regularPrice: 499000,
                    discountPrice: 399000,
                    discountFixed: 100000,
                  },
                  buttons: [
                    {
                      linkType: 'WL',
                      name: '상세 보기',
                      linkMobile: 'https://example.com',
                      linkPc: 'https://example.com',
                    },
                  ],
                },
              ],
              tail: {
                linkMobile: 'https://example.com/all-products',
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
              chatBubbleType: 'CAROUSEL_COMMERCE',
              carousel: {
                list: [
                  {
                    imageId: imageId,
                    commerce: {
                      title: '겨울 롱패딩 - 그레이',
                      regularPrice: 299000,
                      discountPrice: 199000,
                      discountRate: 33,
                    },
                    buttons: [
                      {
                        linkType: 'WL',
                        name: '바로 구매',
                        linkMobile: 'https://example.com/padding-gray',
                      },
                    ],
                  },
                  {
                    imageId: imageId,
                    commerce: {
                      title: '겨울 롱패딩 - 블랙',
                      regularPrice: 299000,
                      discountPrice: 199000,
                      discountRate: 33,
                    },
                    buttons: [
                      {
                        linkType: 'WL',
                        name: '바로 구매',
                        linkMobile: 'https://example.com/padding-black',
                      },
                    ],
                  },
                ],
                tail: {
                  linkMobile: 'https://example.com/winter-sale',
                },
              },
            },
          },
        },
        {scheduledDate: '2025-12-08 00:00:00'},
      )
      .then(res => console.log(res));
  });
