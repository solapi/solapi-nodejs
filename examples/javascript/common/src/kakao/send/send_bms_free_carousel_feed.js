/**
 * 카카오 BMS 자유형 CAROUSEL_FEED 타입 발송 예제
 * 캐러셀 피드 형식으로, 여러 카드를 좌우로 슬라이드하는 구조입니다.
 * 각 카드: header, content, imageId, imageLink, coupon, buttons
 * head 없이 2-6개 아이템, head 포함 시 1-5개 아이템 가능합니다.
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
        chatBubbleType: 'CAROUSEL_FEED',
        carousel: {
          // head 없이 list만 있는 경우 2-6개 아이템
          list: [
            {
              header: '첫 번째 카드 헤더',
              content: '첫 번째 카드 내용입니다.',
              imageId: '업로드한 이미지 ID',
              imageLink: 'https://example.com/image1', // 이미지 클릭 시 이동 URL (선택)
              coupon: {
                title: '10% 할인 쿠폰',
                description: '첫 구매 고객 전용',
                linkMobile: 'https://m.example.com/coupon1',
              },
              buttons: [
                {
                  linkType: 'WL', // 캐러셀 피드는 WL, AL 버튼만 지원
                  name: '자세히 보기',
                  linkMobile: 'https://m.example.com/detail1',
                },
              ],
            },
            {
              header: '두 번째 카드 헤더',
              content: '두 번째 카드 내용입니다.',
              imageId: '업로드한 이미지 ID',
              coupon: {
                title: '5000원 할인 쿠폰',
                description: '주말 특가 할인',
                linkMobile: 'https://m.example.com/coupon2',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '자세히 보기',
                  linkMobile: 'https://m.example.com/detail2',
                },
              ],
            },
            {
              header: '세 번째 카드 헤더',
              content: '세 번째 카드 내용입니다.',
              imageId: '업로드한 이미지 ID',
              buttons: [
                {
                  linkType: 'AL', // 앱링크 버튼
                  name: '앱에서 보기',
                  linkAndroid: 'examplescheme://detail3',
                  linkIos: 'examplescheme://detail3',
                },
              ],
            },
          ],
          // tail: 캐러셀 하단에 "더보기" 링크 (선택)
          tail: {
            linkMobile: 'https://m.example.com/more',
            linkPc: 'https://example.com/more', // 선택
          },
        },
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
          chatBubbleType: 'CAROUSEL_FEED',
          carousel: {
            list: [
              {
                header: '이벤트 1',
                content: '특별 이벤트 안내입니다.',
                imageId: '업로드한 이미지 ID',
                buttons: [
                  {
                    linkType: 'WL',
                    name: '참여하기',
                    linkMobile: 'https://m.example.com/event1',
                  },
                ],
              },
              {
                header: '이벤트 2',
                content: '한정 프로모션 안내입니다.',
                imageId: '업로드한 이미지 ID',
                buttons: [
                  {
                    linkType: 'WL',
                    name: '참여하기',
                    linkMobile: 'https://m.example.com/event2',
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ])
  .then(res => console.log(res));
