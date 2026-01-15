/**
 * 카카오 BMS 자유형 WIDE_ITEM_LIST 타입 발송 예제
 * 와이드 아이템 리스트 형식으로, 메인 와이드 아이템과 서브 와이드 아이템 목록을 표시합니다.
 * header + mainWideItem + subWideItemList 구조입니다.
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
        chatBubbleType: 'WIDE_ITEM_LIST',
        header: '헤더 텍스트 (최대 25자)',
        mainWideItem: {
          title: '메인 와이드 아이템 타이틀 (최대 25자)', // 선택
          imageId: '업로드한 메인 와이드 이미지 ID',
          linkMobile: 'https://m.example.com',
          linkPc: 'https://example.com', // 선택
          // linkAndroid: 'examplescheme://', // 선택
          // linkIos: 'examplescheme://', // 선택
        },
        subWideItemList: [
          {
            title: '서브 와이드 첫번째 아이템 (최대 30자)',
            imageId: '업로드한 서브 와이드 이미지 ID',
            linkMobile: 'https://m.example.com/item1',
            linkPc: 'https://example.com/item1', // 선택
          },
          {
            title: '서브 와이드 두번째 아이템 (최대 30자)',
            imageId: '업로드한 서브 와이드 이미지 ID',
            linkMobile: 'https://m.example.com/item2',
            linkPc: 'https://example.com/item2', // 선택
          },
          {
            title: '서브 와이드 세번째 아이템 (최대 30자)',
            imageId: '업로드한 서브 와이드 이미지 ID',
            linkMobile: 'https://m.example.com/item3',
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
          chatBubbleType: 'WIDE_ITEM_LIST',
          header: '신상품 모음',
          mainWideItem: {
            title: '이번 주 베스트 상품',
            imageId: '업로드한 메인 이미지 ID',
            linkMobile: 'https://m.example.com/best',
          },
          subWideItemList: [
            {
              title: '추천 상품 1',
              imageId: '업로드한 서브 이미지 ID',
              linkMobile: 'https://m.example.com/item1',
            },
            {
              title: '추천 상품 2',
              imageId: '업로드한 서브 이미지 ID',
              linkMobile: 'https://m.example.com/item2',
            },
          ],
        },
      },
    },
  ])
  .then(res => console.log(res));
