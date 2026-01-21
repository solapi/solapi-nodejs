/**
 * 카카오 BMS 자유형 PREMIUM_VIDEO 타입 발송 예제
 * 프리미엄 비디오 메시지로, 카카오TV 영상 URL과 썸네일 이미지를 포함합니다.
 * videoUrl은 반드시 "https://tv.kakao.com/"으로 시작해야 합니다.
 * 유효하지 않은 동영상 URL 기입 시 발송 상태가 그룹 정보를 찾을 수 없음 오류로 표시됩니다.
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

// 최소 구조 단건 발송 예제 (video.videoUrl만)
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    text: '🎬 이번 시즌 인기 드라마 하이라이트!\n놓치신 분들을 위한 명장면 모음입니다.',
    type: 'BMS_FREE',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      bms: {
        targeting: 'I',
        chatBubbleType: 'PREMIUM_VIDEO',
        video: {
          videoUrl: 'https://tv.kakao.com/v/460734285',
        },
      },
    },
  })
  .then(res => console.log(res));

// 썸네일 이미지 업로드 후 전체 필드 발송
messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'KAKAO')
  .then(res => res.fileId)
  .then(imageId => {
    // 전체 필드 단건 발송 예제 (adult, header, content, video 전체, buttons, coupon)
    messageService
      .send({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '🍿 주말 영화 추천!\n\n올해 가장 화제가 된 영화를 미리 만나보세요.',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'PREMIUM_VIDEO',
            adult: false,
            header: '🎥 이 주의 추천 영화',
            content:
              '2024년 최고의 액션 블록버스터! 지금 바로 예고편을 확인해보세요.',
            video: {
              videoUrl: 'https://tv.kakao.com/v/460734285',
              imageId: imageId,
              imageLink: 'https://example.com/movie-trailer',
            },
            buttons: [
              {
                linkType: 'WL',
                name: '예매하기',
                linkMobile: 'https://example.com',
                linkPc: 'https://example.com',
              },
            ],
            coupon: {
              title: '10% 할인 쿠폰',
              description: '영화 예매 시 사용 가능한 할인 쿠폰입니다.',
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
          text: '🎉 신제품 런칭 라이브!\n\n내일 오후 7시, 신제품 공개와 함께 특별 혜택도 준비했어요.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'PREMIUM_VIDEO',
              video: {
                videoUrl: 'https://tv.kakao.com/v/460734285',
              },
              buttons: [
                {
                  linkType: 'WL',
                  name: '라이브 알림 신청',
                  linkMobile: 'https://example.com/live',
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
          text: '🏋️ 오늘의 운동 루틴!\n\n전문 트레이너가 알려주는 10분 코어 운동입니다.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'PREMIUM_VIDEO',
              video: {
                videoUrl: 'https://tv.kakao.com/v/460734285',
              },
            },
          },
        },
        {
          to: '수신번호',
          from: '계정에서 등록한 발신번호 입력',
          text: '🍳 5분 요리 레시피!\n\n바쁜 아침에도 간단하게 만드는 건강 한끼.',
          type: 'BMS_FREE',
          kakaoOptions: {
            pfId: '연동한 비즈니스 채널의 pfId',
            bms: {
              targeting: 'I',
              chatBubbleType: 'PREMIUM_VIDEO',
              video: {
                videoUrl: 'https://tv.kakao.com/v/460734285',
              },
            },
          },
        },
      ])
      .then(res => console.log(res));
  });
