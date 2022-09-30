/**
 * 카카오 비즈니스 채널 연동(생성) 예제, 채널 카테고리 부터 채널 연동까지 모두 들어있는 예제
 */
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService("ENTER_YOUR_API_KEY", "ENTER_YOUR_API_SECRET");

messageService.getKakaoChannelCategories()
    .then(async (res) => {
        // 115번의 카테고리는 컴퓨터,소프트웨어/솔루션,소프트웨어/솔루션
        // 실제 연동하실 때는 각각의 채널에 맞는 카테고리를 선택해주세요!
        const categoryCode = res[115].code;

        const searchId = '채널 검색용 아이디';
        const phoneNumber = '카카오 비즈니스 채널 담당자 휴대전화 번호';

        // token은 API가 아닌 실제 담당자 휴대전화 번호로 전송됩니다.
        await messageService.requestKakaoChannelToken({
            searchId,
            phoneNumber
        });

        messageService.createKakaoChannel({
            searchId,
            categoryCode,
            phoneNumber,
            token: '담당자 휴대전화 번호로 받은 토큰(인증번호) 입력'
        }).then(res => {
            // 채널 데이터를 수신 받으면 성공!
            console.log(res);
        })
    });

/*
messageService.createKakaoChannel({
    searchId: '채널 검색용 아이디 입력',
    phoneNumber: '카카오 비즈니스 채널 담당자 휴대전화 번호 입력',
    categoryCode: '채널 카테고리 조회 메소드로 확인한 카카오 채널 카테고리 코드 입력',
    token: '카카오 채널 토큰 발급 메소드로 확인한 토큰 입력'
}).then(res => console.log(res));*/
