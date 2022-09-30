/**
 * 카카오 비즈니스 채널 연동을 위한 토큰 발급 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.requestKakaoChannelToken({
    searchId: '채널 검색용 아이디 입력',
    phoneNumber: '카카오 비즈니스 채널 담당자 휴대전화 번호 입력'
}).then(res => console.log(res));