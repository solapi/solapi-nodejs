const express = require('express')
const bodyParser = require('body-parser')
const asyncify = require('express-asyncify')
const fs = require('fs')
const path = require('path')
const { config, msg } = require('../../')

// 넘어온 그룹ID로 메시지 목록을 가져오는 API를 사용하므로 API Key, API Secret이 준비되어야 합니다.
config.init({
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})

const app = asyncify(express())
app.use(bodyParser.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/report', async (req, res) => {
  // body에 [] 형식으로 그룹정보 객체 목록이 들어옵니다.
  req.body.forEach(async (groupInfo) => {
    // 그룹ID로 메시지 목록을 가져옵니다. 
    const result = await msg.getGroupMessages(groupInfo.groupId)
    for (messageId in result.messageList) {
      /**
       * 메시지 정보에서 statusCode로 메시지 상태를 확인 할 수 있습니다.
       * 메시지 상태 코드: https://docs.solapi.com/api-reference/message-status-codes
       * 알림톡/문자 모두 정상처리는 4000번
       */
      console.log('메시지 정보:', result.messageList[messageId])
    }
  })
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({})
})

app.listen(8080, () => {
  console.log(`Server is listenning...`)
})
