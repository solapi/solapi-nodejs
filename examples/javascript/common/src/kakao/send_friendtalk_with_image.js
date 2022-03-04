/**
 * 카카오 이미지(사진 1장만 가능) 친구톡 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */
const path = require("path");
const solapi = require("solapi").default;
const messageService = new solapi("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.uploadFile(path.join(__dirname, "../../images/example.jpg"), "KAKAO")
  .then(res => res.fileId)
  .then(fileId => {

    // 단일 발송 예제
    messageService.sendOne({
      to: "수신번호",
      from: "계정에서 등록한 발신번호 입력",
      text: "2,000byte 이내의 메시지 입력",
      kakaoOptions: {
        pfId: "연동한 비즈니스 채널의 pfId",
        imageId: fileId
      }
    }).then(res => console.log(res));

    // 단일 예약 발송 예제
    // 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
    messageService.sendOneFuture({
      to: "수신번호",
      from: "계정에서 등록한 발신번호 입력",
      text: "2,000byte 이내의 메시지 입력",
      kakaoOptions: {
        pfId: "연동한 비즈니스 채널의 pfId",
        imageId: fileId
      }
    }, "2022-02-26 00:00:00").then(res => console.log(res));

    // 여러 메시지 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    messageService.sendMany([
      {
        to: "수신번호",
        from: "계정에서 등록한 발신번호 입력",
        text: "2,000byte 이내의 메시지 입력",
        kakaoOptions: {
          pfId: "연동한 비즈니스 채널의 pfId",
          imageId: fileId
        }
      },
      {
        to: "수신번호",
        from: "계정에서 등록한 발신번호 입력",
        text: "2,000byte 이내의 메시지 입력",
        kakaoOptions: {
          pfId: "연동한 비즈니스 채널의 pfId",
          imageId: fileId
        }
      }
      // 2번째 파라미터 항목인 allowDuplicates 옵션을 true로 설정할 경우 중복 수신번호를 허용합니다.
    ]).then(res => console.log(res));

    // 여러 메시지 예약 발송 예제, 한 번 호출 당 최대 10,000건 까지 발송 가능
    // 예약발송 시 현재 시간보다 과거의 시간을 입력할 경우 즉시 발송됩니다.
    messageService.sendManyFuture([
      {
        to: "수신번호",
        from: "계정에서 등록한 발신번호 입력",
        text: "2,000byte 이내의 메시지 입력",
        kakaoOptions: {
          pfId: "연동한 비즈니스 채널의 pfId",
          imageId: fileId
        }
      },
      {
        to: "수신번호",
        from: "계정에서 등록한 발신번호 입력",
        text: "2,000byte 이내의 메시지 입력",
        kakaoOptions: {
          pfId: "연동한 비즈니스 채널의 pfId",
          imageId: fileId
        }
      },
      // 3번째 파라미터 항목인 allowDuplicates를 true로 설정하면 중복 수신번호를 허용합니다.
    ], "2022-02-26 00:00:00").then(res => console.log(res));
  });
