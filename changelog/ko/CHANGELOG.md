# 5.2.1 (2023년 1월 25일)

- 080 수신 거부 목록을 조회할 수 있는 기능을 추가했습니다.
  - 예제가 추가되었습니다.
- 코드 안정화가 진행되었습니다.
  - 그룹 조회 시 검색 조건이 제대로 작동하지 않는 부분을 안정화 했습니다.

# 5.2.0 (2022년 12월 13일)

- 5.1.1에서 추가된 카카오 알림톡 채널/템플릿 관리 기능을 안정화 했습니다.
    - 템플릿 내 아이템리스트 유형 및 바로연결 버튼 유형이 추가되었습니다.
    - `getKakaoChannels`, `getKakaoAlimtalkTemplates`, `getKakaoChannel`, `getKakaoAlimtalkTemplate`
      , `createKakaoAlimtalkTemplate`, `updateKakaoAlimtalkTemplate`, `cancelInspectionKakaoAlimtalkTemplate`, `deleteKakaoAlimtalkTemplate`, `requestInspectionKakaoAlimtalkTemplate`
      호출 시 실제 각 모델 별 클래스 인스턴스를
      반환하도록 수정되었습니다.
    - KakaoButton 타입이 조금 더 정확하게 타입을 추론하도록 수정되었습니다.
    - 알림톡 템플릿의 이름을 수정할 수 있는 메소드가 추가되었습니다.
        - updateKakaoAlimtalkTemplateName 메소드는 검수 상태와 무관하게 이름을 수정할 수 있습니다.
- send 메소드에 messages 파라미터 이후의 파라미터들을 하나의 오브젝트(requestConfigParameter)로 변경되었습니다.
    - breaking change가 발생하여 예약 발송, 중복 수신번호 허용, appId를 사용하시던 사용자는 업데이트 후 코드를 변경하셔야 합니다.
    - send 메소드에서 messages 파라미터의 타입을 `Message | Array<Message>` 타입이 아닌 `MessageParameter | Array<MessageParameter>`로
      변경했습니다.
        - 따라서 이후 send 메소드 호출 시 단순 오브젝트로만 넣어도 type 경고/에러가 뜨지 않도록 조치되었습니다.
- SDK에서 반환되는 에러들도 가져올 수 있도록 변경되었습니다.
- Message 모델에서 수신번호(to)를 string[] 타입(문자 배열)이 추가되었습니다.
    - 동일한 내용을 여러 건 발송 시 수신번호(to)를 배열로 넣어 여러 건을 발송할 수 있습니다.
