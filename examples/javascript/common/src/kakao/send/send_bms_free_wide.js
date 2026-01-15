/**
 * 카카오 BMS 자유형 WIDE 타입 발송 예제
 * 와이드 이미지 형식으로, 기본 IMAGE 타입보다 넓은 이미지를 표시합니다.
 * 와이드 이미지는 별도의 규격이 필요합니다.
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

// 와이드 이미지 업로드 (800x600 권장)
messageService
  .uploadFile(path.join(__dirname, '../../images/example.jpg'), 'KAKAO')
  .then(res => res.fileId)
  .then(fileId => {
    // 단일 발송 예제
    messageService
      .sendOne({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I', // I: 전체, M/N: 인허가 채널만
            chatBubbleType: 'WIDE',
            imageId: fileId,
          },
        },
      })
      .then(res => console.log(res));

    // 버튼이 포함된 와이드 이미지 발송 예제
    messageService
      .sendOne({
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'WIDE',
            imageId: fileId,
            buttons: [
              {
                linkType: 'WL',
                name: '자세히 보기',
                linkMobile: 'https://m.example.com',
              },
            ],
          },
        },
      })
      .then(res => console.log(res));
  });
