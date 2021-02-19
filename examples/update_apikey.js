const { config, msg } = require('../')

/**
 * apiKey, apiSecret 값이 config.json에 있지 않고 외부에 있을 때 설정 예제입니다.
 */

// apiKey, apiSecret 설정이 가능합니다.
config.init({
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})

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
      to: '01000000001',
      from: '029302266',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.'
    },
    {
      to: '01000000002',
      from: '029302266',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    // ...
    // 1만건까지 추가 가능
  ]
})
