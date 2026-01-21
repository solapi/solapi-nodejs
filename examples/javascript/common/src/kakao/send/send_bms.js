/**
 * 카카오 브랜드 메시지(템플릿 기반) 발송 예제
 * 이 파일은 templateId를 사용한 템플릿 기반 BMS 발송 예제입니다.
 *
 * BMS 자유형(템플릿 없이 직접 메시지 구성) 예제는 아래 파일들을 참고하세요:
 * - send_bms_free_text.js: TEXT 타입 (텍스트 전용)
 * - send_bms_free_text_with_buttons.js: TEXT 타입 + 버튼
 * - send_bms_free_image.js: IMAGE 타입 (이미지 포함)
 * - send_bms_free_image_with_buttons.js: IMAGE 타입 + 버튼
 * - send_bms_free_wide.js: WIDE 타입 (와이드 이미지)
 * - send_bms_free_wide_item_list.js: WIDE_ITEM_LIST 타입 (와이드 아이템 리스트)
 * - send_bms_free_commerce.js: COMMERCE 타입 (상품 메시지)
 * - send_bms_free_carousel_feed.js: CAROUSEL_FEED 타입 (캐러셀 피드)
 * - send_bms_free_carousel_commerce.js: CAROUSEL_COMMERCE 타입 (캐러셀 커머스)
 * - send_bms_free_premium_video.js: PREMIUM_VIDEO 타입 (프리미엄 비디오)
 *
 * targeting 타입 중 M, N의 경우는 카카오 측에서 인허가된 채널만 사용하실 수 있습니다.
 * 그 외의 모든 채널은 I 타입만 사용 가능합니다.
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

// 단일 발송 예제
messageService
  .send({
    to: '수신번호',
    kakaoOptions: {
      pfId: '연동한 비즈니스 채널의 pfId',
      templateId: '등록한 브랜드 메시지 템플릿의 ID',
      variables: {},
      // 템플릿 내 치환문구(변수)가 있는 경우 추가, 반드시 key, value 모두 string으로 기입해야 합니다.
      /*
      variables: {
        "변수명": "임의의 값"
      }
      */
      // 현재 BMS(브랜드 메시지)는 문자로의 대체발송이 비활성화 됩니다.
      bms: {
        targeting: 'I',
      },
    },
  })
  .then(res => console.log(res));
