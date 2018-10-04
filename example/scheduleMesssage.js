const moment = require('moment')
const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
send()
async function send (agent = {}, groupId = undefined) {
  const group = new Group({ agent, groupId })
  await group.createGroup() // groupId 가 없다면 필수로 작동 시켜야 됩니다.
  console.log(group.getGroupId())
  await group.addGroupMessage({
    to: 'TO',
    from: 'FROM',
    text: 'MESSAGE',
    type: 'SMS'
  })
  const date = moment(Date.now() + 60000).format('YYYY-MM-DD HH:mm:ss')
  await group.setScheduledDate(date).catch(console.log)
  await group.cancelScheduled().catch(console.log)
}
