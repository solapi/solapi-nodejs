const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
send({
  text: 'Hello SOLAPI from Javascript',
  type: 'SMS',
  to: '수신번호',
  from: '발신번호'
})
async function send (message) {
  try {
    const group = new Group()
    await group.createGroup()
    await group.addGroupMessage(message)
    await group.deleteGroupMessages()
  } catch (e) {
    console.log(e)
  }
}
