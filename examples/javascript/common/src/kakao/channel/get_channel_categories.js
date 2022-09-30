/**
 * 카카오 비즈니스 채널 카테고리 조회 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getKakaoChannelCategories().then(res => {
    res.forEach(data => {
        // 채널 카테고리 코드
        console.log(data.code);

        console.log('----');

        // 채널 카테고리 이름
        console.log(data.name);
    })
})