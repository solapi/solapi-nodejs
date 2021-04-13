const { msg } = require('../../')

/**
 * Step 2) 인증번호 요청
 * 해당 전화번호로 전화를 걸어 인증번호를 알려줍니다.
 * 리턴되는 Transaction ID와 인증번호(Token)를 기록해두어 다음 Step에서 사용합니다.
 */
const request_voicecall = async () => {
  // 등록된 전화번호 중 인증받을 번호 하나를 입력합니다.
  const phoneNumber = '01000000001'

  const authInfo = {
    authType: 'ARS',
    extras: {
      phoneNumber
    }
  }
  const options = {
    resolveWithFullResponse: true,
    headers: {
      'x-mfa-data': JSON.stringify(authInfo)
    }
  }
  try {
    const result = await msg.put(`/senderid/v1/numbers/${phoneNumber}/authenticate`, {}, options)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
    console.log('mfa:', e.error.mfa)
    console.log('Trasaction ID: ', e.error.mfa.transactionId)
  }
}
request_voicecall()
