const { msg } = require('../../')

/*
 * 조회된 메시지목록 접근하여 세부항목 출력
 */
async function list () {
  try {
    const result = await msg.get_messages()
    for (const [key, val] of Object.entries(result.messageList)) {
      console.log('메시지ID:', key)
      console.log('그룹ID:', val.groupId)
      console.log('타입:', val.type)
      console.log('국가:', val.country)
      console.log('제목(LMS, MMS):', val.subject)
      console.log('내용:', val.text)
      console.log('발신번호:', val.from)
      console.log('수신번호:', val.to)
      console.log('수신시간:', val.dateReceived)
      console.log('상태(처리상태):', val.status)
      console.log('상태(코드):', val.statusCode)
      console.log('상태(텍스트):', val.reason)
      console.log('통신사:', val.networkName)
      console.log('로그:', val.log)
    }
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
