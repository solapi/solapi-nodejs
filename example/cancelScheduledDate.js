const moment = require('moment-timezone')
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
    const scheduledDate = moment().tz('Asia/Seoul').add(1, 'days').format('YYYY-MM-DD H:m:s')
    await group.setScheduledDate(scheduledDate)
    await group.cancelScheduled()
  } catch (e) {
    console.log(e)
  }
}
