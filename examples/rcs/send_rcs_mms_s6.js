const path = require('path')
const { msg } = require('../../')

/**
 * RCS MMS 발송 (카드 6개)
 */
const send = async () => {
  // 이미지 업로드
  try {
    var { fileId: sample1 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample1.png'))
    var { fileId: sample2 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample2.png'))
    var { fileId: sample3 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample3.png'))
    var { fileId: sample4 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample4.png'))
    var { fileId: sample5 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample5.png'))
    var { fileId: sample6 } = await msg.uploadRCSImage(path.join(__dirname, './images/sample6.png'))
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
    return
  }

  try {
    const result = await msg.send({
      messages: [
        // 버튼 없는 RCS MMS 발송
        {
          to: '01000000001',
          from: '029302266',
          subject: 'Sample 1',
          text: '버튼이 포함된 RCS MMS를 발송합니다.',
          imageId: sample1,
          rcsOptions: {
            brandId: 'RC01BR210526093952685ArBrUMyeOTy', // RCSBizCenter(https://www.rcsbizcenter.com/)에서 발급받은 브랜드ID 입력
            mmsType: 'S6', // S3 ~ S6
            buttons: [
              { buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }
              , { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }
              // , { buttonType: 'ML', buttonName: '지도 위치 표시', latitude: '37.280342669603684', longitude: '127.11824209721874', label: '누리고', link: 'https://nurigo.net' }
              // , { buttonType: 'MQ', buttonName: '지도 검색', link: 'https://nurigo.net', query: '(주)누리고' }
              // , { buttonType: 'MR', buttonName: '나의 현재 위치' }
              // , { buttonType: 'CA', buttonName: '캘린더 일정 생성', title: '제목', startTime: '2021-06-19T00:00:00.000Z', endTime: '2021-06-19T09:00:00.000Z', text: '메모' }
              // , { buttonType: 'CL', buttonName: '텍스트 복사', text: '복사할 텍스트 내용' }
              // , { buttonType: 'DL', buttonName: '전화 걸기', phone: '01012345678' }
              // , { buttonType: 'MS', buttonName: '메시지 보내기', phone: '01012345678', text: '보낼 메시지 내용' }
            ],
            additionalBody: [
              {
                imageId: sample2,
                title: 'Sample 2',
                description: 'Description 설명', // 총합 1,300자
                buttons: [{ buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }, { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }]
              },
              {
                imageId: sample3,
                title: 'Sample 3',
                description: 'Description 설명', // 총합 1,300자
                buttons: [{ buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }, { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }]
              },
              {
                imageId: sample4,
                title: 'Sample 4',
                description: 'Description 설명', // 총합 1,300자
                buttons: [{ buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }, { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }]
              },
              {
                imageId: sample5,
                title: 'Sample 5',
                description: 'Description 설명', // 총합 1,300자
                buttons: [{ buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }, { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }]
              },
              {
                imageId: sample6,
                title: 'Sample 6',
                description: 'Description 설명', // 총합 1,300자
                buttons: [{ buttonType: 'WL', buttonName: '버튼 1', link: 'https://nurigo.net' }, { buttonType: 'WL', buttonName: '버튼 2', link: 'https://nurigo.net' }]
              }
            ]
          }
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
