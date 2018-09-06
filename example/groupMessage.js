const { config, Group } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})
send()
getMessageList()
getMyGroupList()
async function send (agent = {}, groupId = undefined) {
  const group = new Group({ agent, groupId })
  await group.createGroup() // groupId 가 없다면 필수로 작동 시켜야 됩니다.
  await group.addGroupMessage({
    to: '수신번호',
    from: '발신번호',
    text: 'hello1',
    type: 'SMS'
  })
  await group.addGroupMessage([{ // 배열을 사용해 여러개의 메시지도 동시 추가가 가능합니다.
    to: '수신번호',
    from: '발신번호',
    text: 'hello2',
    type: 'SMS'
  }, {
    to: '수신번호',
    from: '발신번호',
    text: 'hello3',
    type: 'SMS'
  }])
  console.log(await group.sendMessages()) // 정상적인 발송이라면 Success 라는 문구가 출력됩니다.
}
async function getMessageList (groupId = undefined) {
  const group = new Group({ groupId })
  await group.createGroup() // groupId 가 없다면 필수로 작동 시켜야 됩니다.
  await group.addGroupMessage({
    to: '수신번호',
    from: '발신번호',
    text: 'hello1',
    type: 'SMS'
  })
  await group.addGroupMessage([{ // 배열을 사용해 여러개의 메시지도 동시 추가가 가능합니다.
    to: '수신번호',
    from: '발신번호',
    text: 'hello2',
    type: 'SMS'
  }, {
    to: '수신번호',
    from: '발신번호',
    text: 'hello3',
    type: 'SMS'
  }])
  console.log(await group.getMessageList()) // 생성된 그룹으로 조회
  console.log(await group.getMessageList({ offset: 0, limit: 500 })) // 다른 조건을 사용해서 모든 메시지 조회
}
async function getMyGroupList () {
  console.log(await Group.getMyGroupList())
}
