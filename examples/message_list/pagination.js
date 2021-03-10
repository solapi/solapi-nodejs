const { msg } = require('../../')

/*
 * nextKey를 이용하 페이지 처리
 */

// 한 페이지에 볼러올 목록 개수
const limit = 5

async function list () {
  try {
    // Page 1
    const page1 = await msg.get_messages({
      limit
    })
    console.log(page1)

    // Page 2
    const page2 = await msg.get_messages({
      limit,
      startKey: page1.nextKey
    })
    console.log(page2)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

list()
