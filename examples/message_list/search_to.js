const { msg } = require('../../')

/*
 * 수신번호로 조회
 */

async function list () {
  try {
    const result = await msg.get_messages({
      to: '01000000001' // 조회할 수신번호 입력
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
