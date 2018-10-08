const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
deleteGroup()
async function deleteGroup () {
  try {
    const group = new Group()
    await group.createGroup()
    const groupId = group.getGroupId()
    await Group.deleteGroup(groupId)
  } catch (e) {
    console.log(e)
  }
}
