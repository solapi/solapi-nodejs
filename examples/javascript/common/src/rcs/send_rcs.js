/**
 * RCS 문자 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .sendOne({
    to: '수신번호',
    from: '계정에서 등록한 RCS용 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    rcsOptions: {
      brandId: 'RCS 브랜드의 아이디',
      buttons: [
        {
          buttonType: 'WL',
          buttonName: '웹링크 버튼',
          link: 'https://으로 시작하는 웹링크 주소',
        },
      ],
    },
  })
  .then(res => console.log(res));

// 단일 예약발송 예제, send 메소드로도 동일하게 사용가능
messageService
  .send(
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    '2022-12-08 00:00:00',
  )
  .then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService
  .send([
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    {
      to: '수신번호',
      from: '계정에서 등록한 RCS용 발신번호 입력',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
      rcsOptions: {
        brandId: 'RCS 브랜드의 아이디',
        buttons: [
          {
            buttonType: 'WL',
            buttonName: '웹링크 버튼',
            link: 'https://으로 시작하는 웹링크 주소',
          },
        ],
      },
    },
    // 2번째 파라미터 내 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
  ])
  .then(res => console.log(res));

// 여러 메시지 예약발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService
  .send(
    [
      {
        to: '수신번호',
        from: '계정에서 등록한 RCS용 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        rcsOptions: {
          brandId: 'RCS 브랜드의 아이디',
          buttons: [
            {
              buttonType: 'WL',
              buttonName: '웹링크 버튼',
              link: 'https://으로 시작하는 웹링크 주소',
            },
          ],
        },
      },
      {
        to: '수신번호',
        from: '계정에서 등록한 RCS용 발신번호 입력',
        text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
        rcsOptions: {
          brandId: 'RCS 브랜드의 아이디',
          buttons: [
            {
              buttonType: 'WL',
              buttonName: '웹링크 버튼',
              link: 'https://으로 시작하는 웹링크 주소',
            },
          ],
        },
      },
    ],
    {
      scheduledDate: '2022-12-08 00:00:00',
      // allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
      // allowDuplicates: true,
    },
  )
  .then(res => console.log(res));

// RCS 발송 실패 시 일반 문자로 대체 발송하는 예제
messageService
  .send({
    to: '수신번호',
    from: '계정에서 등록한 RCS용 발신번호 입력',
    text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.',
    rcsOptions: {
      brandId: 'RCS 브랜드의 아이디',
      buttons: [
        {
          buttonType: 'WL',
          buttonName: '웹링크 버튼',
          link: 'https://으로 시작하는 웹링크 주소',
        },
      ],
    },
    replacements: [
      {
        to: '수신번호',
        from: '계정에서 등록한 발신번호 입력',
        text: 'RCS 발송 실패 시 대체 발송될 문자 내용',
      },
    ],
  })
  .then(res => console.log(res));
