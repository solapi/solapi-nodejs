/**
 * 카카오 BMS 자유형 CAROUSEL_COMMERCE 타입 발송 예제
 * 캐러셀 커머스 형식으로, 여러 상품을 슬라이드로 보여주는 구조입니다.
 * head + list(상품카드들) + tail 구조입니다.
 * targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
// imageId는 미리 업로드한 이미지 ID를 사용합니다.
// 이미지 업로드: messageService.uploadFile(filePath, 'KAKAO').then(res => res.fileId)
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I', // I: 전체, M/N: 인허가 채널만
        chatBubbleType: 'CAROUSEL_COMMERCE',
        carousel: {
          // head: 캐러셀 상단 대표 이미지 및 설명 (선택)
          head: {
            header: '이번 주 베스트 상품',
            content: '인기 상품을 만나보세요!',
            imageId: '업로드한 헤드 이미지 ID',
            linkMobile: 'https://m.example.com/best',
            linkPc: 'https://example.com/best', // 선택
          },
          // list: 상품 카드 목록 (head 있으면 1-5개, 없으면 2-6개)
          list: [
            {
              additionalContent: '무료배송', // 부가정보 (선택)
              imageId: '업로드한 상품 이미지 ID',
              coupon: {
                title: '10% 할인 쿠폰',
                description: '신규 회원 전용',
                linkMobile: 'https://m.example.com/coupon1',
              },
              commerce: {
                title: '상품명 1',
                regularPrice: '30000',
                discountPrice: '25000',
                discountRate: '17',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '구매하기',
                  linkMobile: 'https://m.example.com/product1',
                },
              ],
            },
            {
              additionalContent: '오늘 출발',
              imageId: '업로드한 상품 이미지 ID',
              commerce: {
                title: '상품명 2',
                regularPrice: '50000',
                discountPrice: '40000',
                discountRate: '20',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '구매하기',
                  linkMobile: 'https://m.example.com/product2',
                },
              ],
            },
            {
              imageId: '업로드한 상품 이미지 ID',
              commerce: {
                title: '상품명 3',
                regularPrice: '15000',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '구매하기',
                  linkMobile: 'https://m.example.com/product3',
                },
              ],
            },
          ],
          // tail: 캐러셀 하단에 "더보기" 링크 (선택)
          tail: {
            linkMobile: 'https://m.example.com/all-products',
            linkPc: 'https://example.com/all-products', // 선택
          },
        },
      },
    },
  })
  .then(res => console.log(res));

// head 없이 상품만 발송하는 예제
messageService
  .sendOne({
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
              imageId: '업로드한 상품 이미지 ID',
              commerce: {
                title: '한정 특가 상품 A',
                regularPrice: '100000',
                discountPrice: '70000',
                discountRate: '30',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '바로 구매',
                  linkMobile: 'https://m.example.com/productA',
                },
              ],
            },
            {
              imageId: '업로드한 상품 이미지 ID',
              commerce: {
                title: '한정 특가 상품 B',
                regularPrice: '80000',
                discountPrice: '60000',
                discountRate: '25',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '바로 구매',
                  linkMobile: 'https://m.example.com/productB',
                },
              ],
            },
          ],
          tail: {
            linkMobile: 'https://m.example.com/sale',
          },
        },
      },
    },
  })
  .then(res => console.log(res));
