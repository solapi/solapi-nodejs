const { msg } = require('../../')

/**
 * RCS SMS 발송 (최대 1만건 동시 발송)
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
      type: 'RCS_SMS',
      text: 'RCS SMS를 발송합니다.',
      rcsOptions: {
        brandId: 'RC01BR210526093952685ArBrUMyeOTy' // RCSBizCenter(https://www.rcsbizcenter.com/)에서 발급받은 브랜드ID 입력
      }
    },
    // 버튼이 포함된 SMS를 발송합니다. 버튼은 1개만 추가 가능합니다.
    {
      to: [ '01000000004', '01000000005' ], // 수신번호를 array로 입력하면 같은 내용을 여러명에게 보낼 수 있습니다.
      from: '029302266',
      type: 'RCS_SMS',
      text: '버튼이 포함된 RCS SMS를 발송합니다.',
      rcsOptions: {
        brandId: 'RC01BR210526093952685ArBrUMyeOTy',
        buttons: [
          { buttonType: 'WL', buttonName: '홈페이지 바로가기', link: 'https://nurigo.net' }
          // , { buttonType: 'ML', buttonName: '지도 위치 표시', latitude: '37.280342669603684', longitude: '127.11824209721874', label: '누리고', link: 'https://nurigo.net' }
          // , { buttonType: 'MQ', buttonName: '지도 검색', link: 'https://nurigo.net', query: '(주)누리고' }
          // , { buttonType: 'MR', buttonName: '나의 현재 위치' }
          // , { buttonType: 'CA', buttonName: '캘린더 일정 생성', title: '제목', startTime: '2021-06-19T00:00:00.000Z', endTime: '2021-06-19T09:00:00.000Z', text: '메모' }
          // , { buttonType: 'CL', buttonName: '텍스트 복사', text: '복사할 텍스트 내용' }
          // , { buttonType: 'DL', buttonName: '전화 걸기', phone: '01012345678' }
          // , { buttonType: 'MS', buttonName: '메시지 보내기', phone: '01012345678', text: '보낼 메시지 내용' }
        ]
      }
    }

    // ...
    // 1만건까지 추가 가능
  ]
})
