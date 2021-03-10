const { msg } = require('../../')

/**
 * 메시지 목록
 */
async function list () {
  try {
    const result = await msg.get_messages()
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
