# 5.2.0 (2022년 12월 6일)

- 5.1.1에서 추가된 카카오 알림톡 채널/템플릿 관리 기능을 안정화 했습니다.
    - 템플릿 내 아이템리스트 유형 및 바로연결 버튼 유형이 추가되었습니다.
    - `getKakaoChannels`, `getKakaoAlimtalkTemplates`, `getKakaoChannel`, `getKakaoAlimtalkTemplate`
      , `createKakaoAlimtalkTemplate`, `updateKakaoAlimtalkTemplate`, `cancelInspectionKakaoAlimtalkTemplate`, `deleteKakaoAlimtalkTemplate`, `requestInspectionKakaoAlimtalkTemplate` 호출 시 실제 각 모델 별 클래스 인스턴스를
      반환하도록 수정되었습니다.
- send 메소드에 messages 파라미터 이후의 파라미터들을 하나의 오브젝트(requestConfigParameter)로 변경되었습니다.
    - breaking change가 발생하여 예약 발송, 중복 수신번호 허용, appId를 사용하시던 사용자는 업데이트 후 코드를 변경하셔야 합니다.
    - send 메소드에서 messages 파라미터의 타입을 `Message | Array<Message>` 타입이 아닌 `MessageParameter | Array<MessageParameter>`로
      변경했습니다.
        - 따라서 이후 send 메소드 호출 시 단순 오브젝트로만 넣어도 type 경고/에러가 뜨지 않도록 조치되었습니다.
