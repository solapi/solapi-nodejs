/**
 * 카카오 브랜드 메시지 발송 예제
 * 현재 targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 발신번호 입력',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      templateId: '등록한 브랜드 메시지 템플릿의 ID',
      variables: {},
      // 템플릿 내 치환문구(변수)가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
      /*
      variables: {
        "변수명": "임의의 값"
      }
      */
      // 현재 BMS(브랜드 메시지)는 문자로의 대체발송이 비활성화 됩니다.
      bms: {
        targeting: 'I',
      },
    },
  })
  .then(res => console.log(res));
