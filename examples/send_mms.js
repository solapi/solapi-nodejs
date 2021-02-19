const path = require('path')
const { msg } = require('../')

/**
 * MMS 발송 (최대 1만건 동시 발송)
 */

const send = async () => {
  // 이미지 업로드
  try {
    var { fileId } = await msg.uploadMMSImage(path.join(__dirname, '/example.jpg'))
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
    return
  }

  // MMS 발송
  try {
    const result = await msg.send({
      messages: [
        {
          to: '01000000001',
          from: '029302266',
          subject: 'MMS 제목',
          imageId: fileId,
          text: '이미지 아이디가 입력되면 MMS로 발송됩니다.'
        },
        {
          to: '01000000002',
          from: '029302266',
          subject: 'MMS 제목',
          imageId: fileId,
          text: '동일한 이미지 아이디가 입력되면 동일한 이미지가 MMS로 발송됩니다.'
        },
        {
          to: [ '01000000003', '01000000004' ], // array로 입력하면 여러명에게 동일한 내용으로 발송됩니다.
          from: '029302266',
          subject: 'MMS 제목',
          imageId: fileId,
          text: '동일한 이미지 아이디가 입력되면 동일한 이미지가 MMS로 발송됩니다.'
        }

        // ...
        // 1만건까지 추가 가능
      ]
    })
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

send()
