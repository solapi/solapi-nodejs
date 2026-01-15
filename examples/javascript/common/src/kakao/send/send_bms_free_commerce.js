/**
 * 카카오 BMS 자유형 COMMERCE 타입 발송 예제
 * 커머스(상품) 메시지로, 상품 이미지와 가격 정보, 쿠폰을 포함합니다.
 * 이미지 + 상품정보(commerce) + 쿠폰(coupon) + 버튼 조합입니다.
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
        chatBubbleType: 'COMMERCE',
        imageId: '업로드한 상품 이미지 ID',
        commerce: {
          title: '상품명',
          regularPrice: '10000', // 정가
          discountPrice: '8000', // 할인가 (선택)
          discountRate: '20', // 할인율 % (선택)
          discountFixed: '2000', // 할인금액 (선택)
        },
        // 쿠폰 정보 (선택)
        // 쿠폰 제목 형식: "N원 할인 쿠폰", "N% 할인 쿠폰", "배송비 할인 쿠폰", "OOO 무료 쿠폰", "OOO UP 쿠폰"
        coupon: {
          title: '10000원 할인 쿠폰',
          description: '신규 회원 전용 할인 쿠폰입니다.',
          linkMobile: 'https://m.example.com/coupon',
          linkPc: 'https://example.com/coupon', // 선택
        },
        buttons: [
          {
            linkType: 'WL',
            name: '상품 보기',
            linkMobile: 'https://m.example.com/product',
            linkPc: 'https://example.com/product', // 선택
          },
          {
            linkType: 'WL',
            name: '바로 구매',
            linkMobile: 'https://m.example.com/buy',
          },
        ],
      },
    },
  })
  .then(res => console.log(res));

// 쿠폰 없이 상품 정보만 발송하는 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I',
        chatBubbleType: 'COMMERCE',
        imageId: '업로드한 상품 이미지 ID',
        commerce: {
          title: '한정 특가 상품',
          regularPrice: '50000',
          discountPrice: '35000',
          discountRate: '30',
        },
        buttons: [
          {
            linkType: 'WL',
            name: '상품 상세보기',
            linkMobile: 'https://m.example.com/detail',
          },
        ],
      },
    },
  })
  .then(res => console.log(res));

// 여러 메시지 발송 예제
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
          imageId: '업로드한 상품 이미지 ID',
          commerce: {
            title: '베스트 셀러 상품',
            regularPrice: '25000',
            discountPrice: '20000',
          },
          buttons: [
            {
              linkType: 'WL',
              name: '구매하기',
              linkMobile: 'https://m.example.com/buy',
            },
          ],
        },
      },
    },
  ])
  .then(res => console.log(res));
