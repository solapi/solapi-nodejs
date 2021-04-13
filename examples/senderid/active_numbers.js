const { msg } = require('../../')

/**
 * 활성화된 발신번호 목록 조회
 */
const active_numbers = async () => {
  try {
    const result = await msg.get('/senderid/v1/numbers/active')
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}
active_numbers()
