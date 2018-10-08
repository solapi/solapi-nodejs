const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
getGroupInfo()
async function getGroupInfo () {
  try {
    const group = new Group()
    await group.createGroup()
    const groupId = group.getGroupId()
    console.log(await Group.getInfo(groupId))
  } catch (e) {
    console.log(e)
  }
}
