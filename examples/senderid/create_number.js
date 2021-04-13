const { msg } = require('../../')

/**
 * Step 1) 발신번호 등록
 */
const createNumber = async () => {
  // phoneNumber에 발신번호로 등록할 전화번호를 입력합니다.
  const phoneNumber = '01000000001'

  try {
    const result = await msg.post('/senderid/v1/numbers', { phoneNumber })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}
createNumber()
