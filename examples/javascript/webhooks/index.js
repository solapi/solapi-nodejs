const express = require("express");
const bodyParser = require("body-parser");
const asyncify = require("express-asyncify");
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

/**
 * 웹훅 레퍼런스
 * http://developers.solapi.com/references/webhook/
 */

// 넘어온 그룹 ID로 메시지 목록을 가져오는 API를 사용하므로 API Key, API Secret Key가 준비되어야 합니다.
const app = asyncify(express());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

// 메시지 리포트
app.post("/single-report", async (req, res) => {
  // body에 [] 형식으로 메시지정보 객체 목록이 들어옵니다.
  for (const messageInfo of req.body) {
    console.log("메시지 정보:", messageInfo);
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

// 그룹 리포트
app.post("/group-report", async (req, res) => {
  // body에 [] 형식으로 그룹정보 객체 목록이 들어옵니다.
  for (const groupInfo of req.body) {
    // 그룹ID로 메시지 목록을 가져옵니다.
    const result = await messageService.getGroupMessages(groupInfo.groupId);
    for (const messageId in result.messageList) {
      /**
       * 메시지 정보에서 statusCode로 메시지 상태를 확인 할 수 있습니다.
       * 메시지 상태 코드: https://developers.solapi.com/references/message-status-codes
       * 알림톡/문자 모두 정상처리는 4000번
       */
      console.log("메시지 정보:", result.messageList[messageId]);
    }
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

// 팩스 수신
app.post("/fax", async (req, res) => {
  // body에 [] 형식으로 팩스수신정보 객체 목록이 들어옵니다.
  for (const faxInfo of req.body) {
    console.log("팩스 수신 정보:", faxInfo);
  }
  // 200을 리턴해야 합니다. (200이 리턴되지 않으면 특정 시간 간격을 두고 총 5번이 호출됩니다)
  return res.status(200).json({});
});

app.listen(8080, () => {
  console.log(`Server is listening...`);
});
