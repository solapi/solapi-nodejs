const { msg } = require('../../')

// 한번 요청으로 1만건의 네이버톡톡 발송이 가능합니다.
// 등록되어 있는 템플릿의 변수 부분을 제외한 나머지 부분(상수)은 100% 일치해야 합니다.
// 템플릿 내용이 "#{이름}님 가입을 환영합니다."으로 등록되어 있는 경우 변수 #{이름}을 홍길동으로 치환하여 "홍길동님 가입을 환영합니다."로 입력해 주세요.

async function send (params = {}) {
  try {
    const result = await msg.send(params)
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

send({
  messages: [
    {
      type: 'NSA',
      to: '01000000001',
      from: '029302266',
      text: '홍길동님 가입을 환영합니다.',
      naverOptions: {
        talkId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx'
      }
    },
    {
      type: 'NSA',
      to: [ '01000000002', '01000000003' ], // array 사용으로 동일한 내용을 여러 수신번호에 전송 가능
      from: '029302266',
      text: '모두님 가입을 환영합니다.',
      naverOptions: {
        talkId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx'
      }
    },
    {
      type: 'NSA',
      to: '01000000004',
      from: '029302266',
      text: '버튼은 최대 5개까지 추가 가능하며 템플릿 내용과 마찬가지로 버튼 내용도 등록 및 검수 받은 내용 그대로 입력되어야 합니다.',
      naverOptions: {
        talkId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx',
        buttons: [
          {
            buttonType: 'WL', // 웹링크
            buttonCode: 'btn1', // 버튼 코드를 입력하세요. (템플릿 상세보기에서 확인 가능)
            linkMo: 'https://example.com', // URL은 자유롭게 입력 가능
            linkPc: 'https://example.com' // URL은 자유롭게 입력 가능
          },
          {
            buttonType: 'AL', // 앱링크
            buttonCode: 'btn2', // 버튼 코드를 입력하세요. (템플릿 상세보기에서 확인 가능)
            linkAnd: 'examplescheme://',
            linkIos: 'examplescheme://'
          }
        ]
      }
    }

    // ...
    // 계속해서 1만건까지 추가 가능
  ]
})
