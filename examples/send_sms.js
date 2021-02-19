const { msg } = require('../')

/**
 * SMS 발송 (최대 1만건 동시 발송)
 */

async function send (params = {}) {
  try {
    const result = await msg.send(params)
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

send({
  messages: [
    {
      to: '01000000001',
      from: '029302266',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.'
    },
    {
      to: '01000000002',
      from: '029302266',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    {
      type: 'SMS', // 타입 지정
      to: '01000000003',
      from: '029302266',
      text: 'SMS 타입에 한글 45자, 영자 90자 이상 입력되면 오류가 발생합니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    {
      to: [ '01000000004', '01000000005' ], // 수신번호를 array로 입력하면 같은 내용을 여러명에게 보낼 수 있습니다.
      from: '029302266',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },

    // 해외 발송(별도 신청이나 설정없이 해외 발송 가능하며 SMS 타입으로만 발송 가능합니다.)
    {
      country: '1', // 미국(1), 일본(81), 중국(86) 등 국가번호 입력
      to: '01000000006', // 현지 전화번호
      from: '029302266', // 입력한 번호와 관계없이 NURIGO로 표시되며 일부 국가에서는 임의의 번호로 발송됩니다.
      text: '한글 45자, 영자 90자 이하로만 입력해 주세요.'
    }

    // ...
    // 1만건까지 추가 가능
  ]
})
