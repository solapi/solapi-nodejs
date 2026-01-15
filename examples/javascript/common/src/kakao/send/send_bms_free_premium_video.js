/**
 * 카카오 BMS 자유형 PREMIUM_VIDEO 타입 발송 예제
 * 프리미엄 비디오 메시지로, 카카오TV 영상 URL과 썸네일 이미지를 포함합니다.
 * video: { videoUrl, imageId, imageLink } 구조입니다.
 * videoUrl은 반드시 "https://tv.kakao.com/"으로 시작해야 합니다.
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
    text: '동영상 메시지입니다. 아래 영상을 확인해보세요!',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I', // I: 전체, M/N: 인허가 채널만
        chatBubbleType: 'PREMIUM_VIDEO',
        video: {
          // videoUrl은 반드시 카카오TV URL이어야 합니다
          videoUrl: 'https://tv.kakao.com/v/123456789',
          imageId: '업로드한 썸네일 이미지 ID', // 선택 (영상 썸네일)
          imageLink: 'https://example.com/video-detail', // 선택 (이미지 클릭 시 이동 URL)
        },
      },
    },
  })
  .then(res => console.log(res));

// 버튼이 포함된 프리미엄 비디오 발송 예제
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '신제품 소개 영상입니다.',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I',
        chatBubbleType: 'PREMIUM_VIDEO',
        video: {
          videoUrl: 'https://tv.kakao.com/v/123456789',
          imageId: '업로드한 썸네일 이미지 ID',
        },
        buttons: [
          {
            linkType: 'WL',
            name: '제품 상세보기',
            linkMobile: 'https://m.example.com/product',
          },
          {
            linkType: 'WL',
            name: '구매하기',
            linkMobile: 'https://m.example.com/buy',
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
      text: '이벤트 홍보 영상입니다.',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'PREMIUM_VIDEO',
          video: {
            videoUrl: 'https://tv.kakao.com/v/123456789',
          },
          buttons: [
            {
              linkType: 'WL',
              name: '이벤트 참여하기',
              linkMobile: 'https://m.example.com/event',
            },
          ],
        },
      },
    },
  ])
  .then(res => console.log(res));
