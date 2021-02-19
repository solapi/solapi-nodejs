const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
getGroupMessages({
  type: 'SMS',
  text: 'Hello, this is SMS',
  to: '수신 번호',
  from: '발신 번호'
})
async function getGroupMessages (message) {
  try {
    const group = new Group()
    await group.createGroup()
    await group.addGroupMessage(message)
    console.log(await group.getMessageList())
  } catch (e) {
    console.log(e)
  }
}
