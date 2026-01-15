/**
 * 카카오 BMS 자유형 TEXT 타입 발송 예제
 * 텍스트만 포함하는 가장 기본적인 BMS 자유형 메시지입니다.
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
        chatBubbleType: 'TEXT',
      },
    },
  })
  .then(res => console.log(res));

// 단일 예약 발송 예제
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .sendOneFuture(
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
    '2025-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 발신번호 입력',
      text: '2,000byte 이내의 메시지 입력',
      type: 'BMS_FREE',
      kakaoOptions: {
        pfId: '연동한 비즈니스 채널의 pfId',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      },
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'TEXT',
          },
        },
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: '2,000byte 이내의 메시지 입력',
        type: 'BMS_FREE',
        kakaoOptions: {
          pfId: '연동한 비즈니스 채널의 pfId',
          bms: {
            targeting: 'I',
            chatBubbleType: 'TEXT',
          },
        },
      },
    ],
    {
      scheduledDate: '2025-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));
