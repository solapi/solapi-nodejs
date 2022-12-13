/**
 * 카카오 알림톡 템플릿 수정 예제
 * 알림톡 템플릿을 수정할 때에는 반드시 대기 상태에서만 수정할 수 있습니다.
 */
const {SolapiMessageService} = require('solapi');
const messageService = new SolapiMessageService(
  'ENTER_YOUR_API_KEY',
  'ENTER_YOUR_API_SECRET',
);

messageService
  .updateKakaoAlimtalkTemplate('수정할 알림톡 템플릿 ID', {
    //name: '수정할 템플릿 제목(등록된 템플릿과 중복불가)',
    //content: '수정할 템플릿 내용',
    //categoryCode: '999999', // 카테고리 코드, 카테고리 코드를 미리 조회하신 다음 코드를 입력해주세요.
    /**
     * 알림톡 버튼, 최대 5개까지 입력할 수 있으며, 바로연결이 추가되면 최대 두개까지만 추가될 수 있습니다.
     */
    /*buttons: [
        {
          buttonName: '버튼이름',
          /!**
           * 카카오 버튼 타입에 대한 설명은 아래 페이지를 참고해주세요!
           * @see https://developers.solapi.com/references/kakao/button-link-type
           *!/
          buttonType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/
    /**
     * 바로연결, 10개까지만 등록할 수 있으며, 바로연결이 추가되면 버튼은 최대 두개까지 추가될 수 있습니다.
     */
    /*quickReplies: [
        {
          name: '바로연결 버튼이름',
          /!**
           * 카카오 버튼 타입에 대한 설명은 아래 페이지를 참고해주세요!
           * @see https://developers.solapi.com/references/kakao/button-link-type
           * 바로연결에서 허용되는 버튼 타입은 아래와 같습니다.
           * WL: 웹링크, AL: 앱링크, BK: 봇키워드, BT: 봇전환, BC: 상담톡전환
           *!/
          linkType: 'WL',
          linkMo: 'https://m.example.com',
          linkPc: 'https://example.com',
        },
      ],*/
    /**
     * 카카오 알림톡 템플릿 메시지 유형
     * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
     * 미지정시 기본값은 기본형(BA)입니다.
     */
    //messageType: 'BA',
    /**
     * 카카오 알림톡 템플릿 강조 유형
     * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형, ITEM_LIST: 아이템리스트형
     * 미지정시 기본값은 선택안함(NONE) 입니다.
     * 강조 유형에 대한 자세한 설명은 아래 페이지를 참고해주세요!
     * @see https://developers.solapi.com/references/kakao/templates/createTemplate#%EA%B0%95%EC%A1%B0-%EC%9C%A0%ED%98%95
     */
    //emphasizeType: 'NONE',
    // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 제목
    //emphasizeTitle: '',
    // 강조표기형(TEXT) 유형일 때 추가할 수 있는 강조표기형 부제목
    //emphasizeSubTitle: '',
    /**
     * 아이템 리스트(ITEM_LIST) 유형에서만 사용 가능한 알림톡 헤더.
     * 변수(치환문구) 포함 가능. 최대 16자
     */
    //header: '헤더 입력',
    //알림톡 하이라이트, 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
    /*highlight: {
        title: '하이라이트 제목', // 알림톡 하이라이트 제목, 변수 포함가능 및 최대 30자까지 입력 가능
        description: '', // 알림톡 하이라이트 내용. 변수 포함 불가능. 최대 16자까지 입력 가능
        /!**
         * 알림톡에 사용되는 이미지 고유 아이디. 이미지 타입이 ATA일 경우에만 사용 가능합니다.
         * 이미지 ID에 관한 설명은 아래 페이지를 확인해보세요!
         * @see https://developers.solapi.com/references/storage
         *!/
        // imageId: ''
      },*/
    // 알림톡 아이템, 목록과 요약이 있습니다. 강조 유형이 아이템 리스트일 때만 사용 가능합니다.
    /*item: {
        // 알림톡 아이템 리스트, 최소 2개, 최대 10개까지 등록할 수 있습니다.
        list: [
          {
            title: '아이템리스트', // 아이템 리스트 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
            description: '아이템 리스트 내용', // 아이템 리스트 내용, 변수 포함가능, 최대 23까지 입력 가능합니다.
          },
        ],
        summary: {
          title: '', // 알림톡 아이템 리스트 요약 제목, 변수 포함 불가, 최대 6자까지 입력 가능합니다.
          description: '', // 알림톡 아이템 리스트 요약 내용. 변수 포함 가능. 화폐 단위, 숫자, 쉼표, 마침표만 사용 가능합니다. 최대 14자까지 입력 가능합니다.
        },
      },*/
    // 부가정보. 변수 포함 불가능. 최대 500자
    //extra: '',
    /**
     * 보안 템플릿 여부. true일 경우 해당 템플릿을 PC에서는 확인할 수 없습니다. 기본값: false
     * 미지정시 기본값은 false 입니다.
     */
    //securityFlag: false,
    //알림톡에 사용되는 이미지 고유 아이디. 이미지 타입이 ATA일 경우에만 사용 가능합니다.
    //imageId: '',
  })
  .then(res => {
    console.log(res);

    // 수정한 카카오 알림톡 템플릿을 즉시 검수할 수 있습니다.
    /*messageService
        .requestInspectionKakaoAlimtalkTemplate(res.templateId)
        .then(res2 => console.log(res2));*/
  });
