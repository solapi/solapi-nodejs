/**
 * 카카오 비즈니스 채널 연동(생성) 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.createKakaoChannel({
    searchId: '채널 검색용 아이디 입력',
    phoneNumber: '카카오 비즈니스 채널 담당자 휴대전화 번호 입력',
    categoryCode: '채널 카테고리 조회 메소드로 확인한 카카오 채널 카테고리 코드 입력',
    token: '카카오 채널 토큰 발급 메소드로 확인한 토큰 입력'
}).then(res => console.log(res));