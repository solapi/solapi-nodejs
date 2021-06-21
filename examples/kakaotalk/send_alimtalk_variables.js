const { msg } = require('../../')

// 한번 요청으로 1만건의 알림톡 발송이 가능합니다.
// 변수: 값 형식으로 변수값만 입력해주면 템플릿의 모든 내용을 서버에 저장된 값을 사용하여 발송합니다.

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
    // 알림톡 내용 및 버튼에 변수가 있는 경우
    {
      to: '01000000001',
      from: '029302266',
      kakaoOptions: {
        pfId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx',
        variables: {
          '#{변수1}': '변수1의 값',
          '#{변수2}': '변수2의 값',
          '#{버튼링크}': 'example.com/link1'
        }
      }
    },
    // 알림톡 내용 및 버튼에 변수가 없는 경우
    {
      to: '01000000002',
      from: '029302266',
      kakaoOptions: {
        pfId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx',
        variables: {} // 빈 Object로 입력
      }
    },
    {
      to: [ '01000000003', '01000000004' ], // array 사용으로 동일한 내용을 여러 수신번호에 전송 가능
      from: '029302266',
      kakaoOptions: {
        pfId: 'KA01PF200323182344986oTFz9CIabcx',
        templateId: 'KA01TP200323182345741y9yF20aabcx',
        variables: {
          '#{변수1}': '변수1의 값',
          '#{변수2}': '변수2의 값',
          '#{버튼링크}': 'example.com/link1'
        }
      }
    }
    // ...
    // 계속해서 1만건까지 추가 가능
  ]
})
