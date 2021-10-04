const { msg } = require('../../')

/**
 * 수신번호 중복 허용 예제
 */

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
  allowDuplicates: true, // 수신번호 중복 허용
  messages: [
    {
      to: '01000000001',
      from: '029302266',
      text: '동일한 수신번호로 발송 #1'
    },
    {
      to: '01000000001',
      from: '029302266',
      text: '동일한 수신번호로 발송 #2' // 동일한 내용 입력 시 수신된 문자는 하나로 보여질 수 있습니다
    }
    // ...
    // 1만건까지 추가 가능
  ]
})
