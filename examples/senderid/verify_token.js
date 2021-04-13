const { msg } = require('../../')

/**
 * Step 3) 인증번호 확인
 * Step 2 과정에서 획득한 정보를 모두 입력하여 인증받습니다.
 */
const verifyToken = async () => {
  // 전화번호 입력
  const phoneNumber = '01000000001'
  // Transaction ID 입력
  const transactionId = '2a65ff6ed9b074eaddf34fb3d0b19581'
  // 음성으로 전달받은 인증번호
  const token = '0000'

  const authInfo = {
    authType: 'ARS',
    extras: {
      phoneNumber
    },
    transactionId,
    token
  }
  const options = {
    headers: {
      'x-mfa-data': JSON.stringify(authInfo)
    }
  }
  try {
    const result = await msg.put(`/senderid/v1/numbers/${phoneNumber}/authenticate`, {}, options)
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}
verifyToken()
