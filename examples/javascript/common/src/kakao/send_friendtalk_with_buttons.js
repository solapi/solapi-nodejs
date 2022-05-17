/**
 * 버튼을 포함한 카카오 친구톡 발송 예제
 * 버튼은 최대 5개까지 추가할 수 있습니다.
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

// 단일 발송 예제
messageService.sendOne({
  to: "수신번호",
  from: "계정에서 등록한 발신번호 입력",
  text: "2,000byte 이내의 메시지 입력",
  kakaoOptions: {
    pfId: "연동한 비즈니스 채널의 pfId",
    buttons: [
      {
        buttonType: "WL", // 웹링크
        buttonName: "버튼 이름",
        linkMo: "https://m.example.com",
        linkPc: "https://example.com" // 생략 가능
      },
      {
        buttonType: "AL", // 앱링크
        buttonName: "실행 버튼",
        linkAnd: "examplescheme://",
        linkIos: "examplescheme://"
      },
      {
        buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
        buttonName: "봇키워드"
      },
      {
        buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
        buttonName: "상담요청하기"
      },
      {
        buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
        buttonName: "상담톡 전환"
      },
      {
        buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
        buttonName: "챗봇 문의"
      }
    ]
  }
}).then(res => console.log(res));

// 단일 예약 발송 예제
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService.sendOneFuture({
  to: "수신번호",
  from: "계정에서 등록한 발신번호 입력",
  text: "2,000byte 이내의 메시지 입력",
  kakaoOptions: {
    pfId: "연동한 비즈니스 채널의 pfId",
    buttons: [
      {
        buttonType: "WL", // 웹링크
        buttonName: "버튼 이름",
        linkMo: "https://m.example.com",
        linkPc: "https://example.com" // 생략 가능
      },
      {
        buttonType: "AL", // 앱링크
        buttonName: "실행 버튼",
        linkAnd: "examplescheme://",
        linkIos: "examplescheme://"
      },
      {
        buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
        buttonName: "봇키워드"
      },
      {
        buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
        buttonName: "상담요청하기"
      },
      {
        buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
        buttonName: "상담톡 전환"
      },
      {
        buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
        buttonName: "챗봇 문의"
      }
    ]
  }
}, "2022-02-26 00:00:00").then(res => console.log(res));

// 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
messageService.sendMany([
  {
    to: "수신번호",
    from: "계정에서 등록한 발신번호 입력",
    text: "2,000byte 이내의 메시지 입력",
    kakaoOptions: {
      pfId: "연동한 비즈니스 채널의 pfId",
      buttons: [
        {
          buttonType: "WL", // 웹링크
          buttonName: "버튼 이름",
          linkMo: "https://m.example.com",
          linkPc: "https://example.com" // 생략 가능
        },
        {
          buttonType: "AL", // 앱링크
          buttonName: "실행 버튼",
          linkAnd: "examplescheme://",
          linkIos: "examplescheme://"
        },
        {
          buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
          buttonName: "봇키워드"
        },
        {
          buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
          buttonName: "상담요청하기"
        },
        {
          buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
          buttonName: "상담톡 전환"
        },
        {
          buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
          buttonName: "챗봇 문의"
        }
      ]
    }
  },
  {
    to: "수신번호",
    from: "계정에서 등록한 발신번호 입력",
    text: "2,000byte 이내의 메시지 입력",
    kakaoOptions: {
      pfId: "연동한 비즈니스 채널의 pfId",
      buttons: [
        {
          buttonType: "WL", // 웹링크
          buttonName: "버튼 이름",
          linkMo: "https://m.example.com",
          linkPc: "https://example.com" // 생략 가능
        },
        {
          buttonType: "AL", // 앱링크
          buttonName: "실행 버튼",
          linkAnd: "examplescheme://",
          linkIos: "examplescheme://"
        },
        {
          buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
          buttonName: "봇키워드"
        },
        {
          buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
          buttonName: "상담요청하기"
        },
        {
          buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
          buttonName: "상담톡 전환"
        },
        {
          buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
          buttonName: "챗봇 문의"
        }
      ]
    }
  }
  // 2번째 파라미터 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
]).then(res => console.log(res));

// 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
// 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
messageService.sendManyFuture([
  {
    to: "수신번호",
    from: "계정에서 등록한 발신번호 입력",
    text: "2,000byte 이내의 메시지 입력",
    kakaoOptions: {
      pfId: "연동한 비즈니스 채널의 pfId",
      buttons: [
        {
          buttonType: "WL", // 웹링크
          buttonName: "버튼 이름",
          linkMo: "https://m.example.com",
          linkPc: "https://example.com" // 생략 가능
        },
        {
          buttonType: "AL", // 앱링크
          buttonName: "실행 버튼",
          linkAnd: "examplescheme://",
          linkIos: "examplescheme://"
        },
        {
          buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
          buttonName: "봇키워드"
        },
        {
          buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
          buttonName: "상담요청하기"
        },
        {
          buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
          buttonName: "상담톡 전환"
        },
        {
          buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
          buttonName: "챗봇 문의"
        }
      ]
    }
  },
  {
    to: "수신번호",
    from: "계정에서 등록한 발신번호 입력",
    text: "2,000byte 이내의 메시지 입력",
    kakaoOptions: {
      pfId: "연동한 비즈니스 채널의 pfId",
      buttons: [
        {
          buttonType: "WL", // 웹링크
          buttonName: "버튼 이름",
          linkMo: "https://m.example.com",
          linkPc: "https://example.com" // 생략 가능
        },
        {
          buttonType: "AL", // 앱링크
          buttonName: "실행 버튼",
          linkAnd: "examplescheme://",
          linkIos: "examplescheme://"
        },
        {
          buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
          buttonName: "봇키워드"
        },
        {
          buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
          buttonName: "상담요청하기"
        },
        {
          buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
          buttonName: "상담톡 전환"
        },
        {
          buttonType: "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
          buttonName: "챗봇 문의"
        }
      ]
    }
  },
  // 3번째 파라미터 항목인 allowDuplicates를 true로 설정하면 중복 수신번호를 허용합니다.
], "2022-02-26 00:00:00").then(res => console.log(res));
