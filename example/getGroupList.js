const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
getGroupList()
async function getGroupList () {
  try {
    const group = new Group()
    await group.createGroup()
    console.log(await Group.getMyGroupList())
  } catch (e) {
    console.log(e)
  }
}
