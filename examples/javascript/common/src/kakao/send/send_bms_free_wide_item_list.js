/**
 * 카카오 BMS 자유형 WIDE_ITEM_LIST 타입 발송 예제
 * 와이드 아이템 리스트 형식으로, 메인 와이드 아이템과 서브 와이드 아이템 목록을 표시합니다.
 * header + mainWideItem + subWideItemList (최소 3개) 구조입니다.
 * 메인 아이템 이미지: 'BMS_WIDE_MAIN_ITEM_LIST' fileType (2:1 비율 이미지 필수)
 * 서브 아이템 이미지: 'BMS_WIDE_SUB_ITEM_LIST' fileType (1:1 비율 이미지 필수)
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

// 메인/서브 이미지 업로드 (각각 다른 fileType 및 비율 사용)
async function uploadImages() {
  // 메인 아이템: 2:1 비율 이미지 + BMS_WIDE_MAIN_ITEM_LIST fileType
  const mainImage = await messageService.uploadFile(
    path.join(__dirname, '../../images/example-2to1.jpg'),
    'BMS_WIDE_MAIN_ITEM_LIST',
  );
  // 서브 아이템: 1:1 비율 이미지 + BMS_WIDE_SUB_ITEM_LIST fileType
  const subImage = await messageService.uploadFile(
    path.join(__dirname, '../../images/example-1to1.jpg'),
    'BMS_WIDE_SUB_ITEM_LIST',
  );
  return {mainImageId: mainImage.fileId, subImageId: subImage.fileId};
}

uploadImages().then(({mainImageId, subImageId}) => {
  // 최소 구조 단건 발송 예제 (header, mainWideItem, subWideItemList 3개)
  messageService
    .send({
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'WIDE_ITEM_LIST',
          header: '🛍️ 이번 주 베스트 상품',
          mainWideItem: {
            title: '프리미엄 블렌드 원두 1kg',
            imageId: mainImageId,
            linkMobile: 'https://example.com/main',
          },
          subWideItemList: [
            {
              title: '아메리카노 캡슐 30개입',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub1',
            },
            {
              title: '핸드드립 필터 100매',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub2',
            },
            {
              title: '보온 텀블러 500ml',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub3',
            },
          ],
        },
      },
    })
    .then(res => console.log(res));

  // 전체 필드 단건 발송 예제 (adult, header, mainWideItem, subWideItemList, buttons, coupon)
  messageService
    .send({
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'WIDE_ITEM_LIST',
          adult: false,
          header: '🎁 홍길동님을 위한 맞춤 추천',
          mainWideItem: {
            title: '시그니처 스킨케어 세트',
            imageId: mainImageId,
            linkMobile: 'https://example.com/main',
          },
          subWideItemList: [
            {
              title: '수분 에센스 50ml',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub1',
            },
            {
              title: '영양 크림 30ml',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub2',
            },
            {
              title: '선케어 SPF50+ 60ml',
              imageId: subImageId,
              linkMobile: 'https://example.com/sub3',
            },
          ],
          buttons: [
            {
              linkType: 'WL',
              name: '전체 상품 보기',
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
            title: '첫구매 무료 쿠폰',
            description: '첫 구매 고객님께 드리는 특별 혜택입니다.',
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
            chatBubbleType: 'WIDE_ITEM_LIST',
            header: '📚 주간 베스트셀러 TOP4',
            mainWideItem: {
              title: '올해의 필독서 - 성장의 법칙',
              imageId: mainImageId,
              linkMobile: 'https://example.com/main',
            },
            subWideItemList: [
              {
                title: '마음의 정원 - 에세이',
                imageId: subImageId,
                linkMobile: 'https://example.com/sub1',
              },
              {
                title: '미래를 읽는 기술',
                imageId: subImageId,
                linkMobile: 'https://example.com/sub2',
              },
              {
                title: '요리의 기초 - 레시피북',
                imageId: subImageId,
                linkMobile: 'https://example.com/sub3',
              },
            ],
          },
        },
      },
      {scheduledDate: '2025-12-08 00:00:00'},
    )
    .then(res => console.log(res));
});
