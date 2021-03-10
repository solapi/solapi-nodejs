const { msg } = require('../../')

/*
 * 그룹 아아디로 조회
 */

async function list () {
  try {
    const result = await msg.get_messages({
      groupId: 'G4V20210309180637P1RJKXZMV3X9PQC' // 조회 할 그룹아이디 입력
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
