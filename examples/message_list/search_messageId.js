const { msg } = require('../../')

/*
 * 메시지 아이디로 조회
 */

async function list () {
  try {
    const result = await msg.get_messages({
      messageId: 'M4V20210309180637GRT4ZBYGQHCN8UF' // 조회할 메시지 아이디 입력
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
