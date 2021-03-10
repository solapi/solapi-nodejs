const { msg } = require('../../')

/*
 * 메시지 상태 코드로 조회
 */

async function list () {
  try {
    const result = await msg.get_messages({
      statusCode: '4000' // 발송 성공한 내역만 조회
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
