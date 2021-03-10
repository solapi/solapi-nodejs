const { msg } = require('../../')

/*
 * 날짜 조회
 */

// 검색 시간은 ISO8601 포맷으로 입력
const startDate = new Date('2021/02/01/00:00:00').toISOString()
const endDate = new Date('2021/02/28/23:59:59').toISOString()

async function list () {
  try {
    const result = await msg.get_messages({
      limit: 10, // 한 페이지에 볼러올 목록 개수
      startDate,
      endDate,
      dateType: 'CREATED' // CREATED(접수일시 기준으로 조회) | UPDATED(업데이트 일시 기준으로 조회)
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
