/**
 * 카카오 알림톡(이미지 알림톡 포함, 이미지 알림톡은 별도의 추가 파라미터가 없습니다) 대량 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
 const { SolapiMessageService } = require("solapi");
 const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.createGroup()
  .then(async (groupId) => {
    // 10,000건 씩 끊어서 반복하여 그룹에 메시지를 적재할 수 있음, 한 요청 당 10,000건이 가능하며 그룹 당 최대 100만 건 까지 가능
    await messageService.addMessagesToGroup(groupId, [
        {
            to: "수신번호",
            from: "계정에서 등록한 발신번호 입력",
            kakaoOptions: {
                pfId: "연동한 비즈니스 채널의 pfId",
                templateId: "등록한 알림톡 템플릿의 ID",
                variables: {}
                // 치환문구가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
                /*
                variables: {
                "#{변수명}": "임의의 값"
                }
                */
                // disbaleSms 값을 true로 줄 경우 문자로의 대체발송이 비활성화 됩니다.
                // disableSms: true,
            }
        }
    ]);

    // 실제 적재된 그룹에 대한 전체 발송 접수 요청
    messageService.sendGroup(groupId);
  });
