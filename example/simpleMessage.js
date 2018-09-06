const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
send({
  type: 'SMS',
  text: 'Hello, this is SMS',
  to: '수신 번호',
  from: '발신 번호'
})
async function send (message, agent = {}) {
  console.log(await Group.sendSimpleMessage(message, agent))
}
