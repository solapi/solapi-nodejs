const { config, Group } = require('../')
config.init({
  // https://solapi.com/credentials
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})
const messageParams = {
  type: 'ATA',
  subject: 'this is ATA',
  text: 'Hello, this is ATA',
  to: '수신 번호',
  // https://solapi.com/senderids
  from: '발신 번호',
  kakaoOptions: {
    disableSms: true,
    // https://solapi.com/kakao/plus-friends
    pfId: 'ENTER_YOUR_PFID',
    // https://solapi.com/kakao/templates
    templateId: 'ENTER_YOUR_TEMPLATE_ID',
    buttons: [
      {
        buttonName: 'YOUR_BUTTON_NAME',
        buttonType: 'YOUR_BUTTON_TYPE',
        linkMo: 'YOUR_BUTTON_LINK',
        linkPc: 'YOUR_BUTTON_LINK',
        linkAnd: 'YOUR_BUTTON_LINK',
        linkIos: 'YOUR_BUTTON_LINK'
      }
    ]
  }
}

// send ATA (알림톡)
main()

async function main () {
  try {
    const response = await send(messageParams)
    console.info(response)
  } catch (error) {
    console.error(error)
  }
}

function send (params, agent = {}) {
  return Group.sendSimpleMessage(params, agent)
}
