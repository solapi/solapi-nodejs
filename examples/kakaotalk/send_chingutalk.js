const path = require('path')
const { msg } = require('../../')

// 한번 요청으로 1만건의 친구톡 발송이 가능합니다.
// 카카오톡채널 친구로 추가되어 있어야 친구톡 발송이 가능합니다.
// 템플릿 등록없이 버튼을 포함하여 자유롭게 메시지 전송이 가능합니다.

const send = async () => {
  // 이미지 업로드
  try {
    var { fileId } = await msg.uploadKakaoImage(path.join(__dirname, '../example.jpg'), 'https://example.com')
  } catch (e) {
    console.log(e)
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
    return
  }

  try {
    const result = await msg.send({
      messages: [
        {
          to: '01000000001',
          from: '029302266',
          text: '카카오톡채널 친구로 추가되어 있어야 친구톡 발송이 가능하며 광고를 포함하여 자유롭게 내용 입력이 가능합니다.',
          kakaoOptions: {
            pfId: 'KA01PF200323182344986oTFz9CIabcx',
            adFlag: true // 광고 표시 여부(기본값 false)
          }
        },
        {
          to: [ '01000000002', '01000000003' ], // array 사용으로 동일한 내용을 여러 수신번호에 전송 가능
          from: '029302266',
          text: '카카오톡채널 친구로 추가되어 있어야 친구톡 발송이 가능합니다.',
          kakaoOptions: {
            pfId: 'KA01PF200323182344986oTFz9CIabcx'
          }
        },
        {
          to: '01000000004',
          from: '029302266',
          text: '버튼은 최대 5개까지 추가 가능하며 내용과 마찬가지로 자유롭게 입력이 가능합니다.',
          kakaoOptions: {
            pfId: 'KA01PF200323182344986oTFz9CIabcx',
            buttons: [
              {
                buttonType: 'WL', // 웹링크
                buttonName: '버튼 이름',
                linkMo: 'https://m.example.com',
                linkPc: 'https://example.com' // 생략 가능
              },
              {
                buttonType: 'AL', // 앱링크
                buttonName: '실행 버튼',
                linkAnd: 'examplescheme://',
                linkIos: 'examplescheme://'
              },
              {
                buttonType: 'BK', // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
                buttonName: '봇키워드'
              },
              {
                buttonType: 'MD', // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
                buttonName: '상담요청하기'
              },
              {
                buttonType: 'BC', // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
                buttonName: '상담톡 전환'
              },
              {
                buttonType: 'BT', // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
                buttonName: '챗봇 문의'
              }
            ]
          }
        },
        // 친구톡 이미지 발송
        {
          to: '01000000005',
          from: '029302266',
          text: '카카오톡채널 친구로 추가되어 있어야 친구톡 발송이 가능합니다.',
          kakaoOptions: {
            pfId: 'KA01PF200323182344986oTFz9CIabcx',
            imageId: fileId
          }
        }

        // ...
        // 계속해서 1만건까지 추가 가능
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
