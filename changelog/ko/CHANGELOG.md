# 5.4.0 (2025년 3월 10일)

## 변경사항
* crypto-js, nanoid, cross-fetch 의존성을 제거했습니다!
* eslint 버전을 8에서 9버전으로 마이그레이션 했습니다!
* yarn 버전을 3.2.3에서 4.6.0으로 업그레이드 했습니다!
* 이제 index.mjs로 ES Module을 지원합니다!
* fax 발송을 위한 faxOptions 프로퍼티를 Message 모델에 추가했습니다!
* SDK 번들 방식이 sourceMap을 사용하고 js inline optimize를 진행하도록 변경했습니다!

## 중요 안내사항
* SOLAPI Node.js SDK는 5.4.0 버전 이상부터 Node.js 18이상의 버전만 호환합니다, 그 아래의 Node.js 버전을 사용하신다면 5.3.1 버전의 SDK를 사용해주세요!!
* sendMany, sendManyFuture 메소드를 제거했습니다. 5.4.0 버전 부터는 send 메소드로 대체하여 사용해주세요!!
* sendOneFuture 메소드를 decpreated로 전환했습니다. 해당 메소드는 5.5.0에 삭제될 예정입니다, send 메소드로 대체하여 사용해주세요!!

### 번외
* Next.js를 이용하여 UI를 통해 SMS/카카오 알림톡 발송을 확인해볼 수 있는 예제를 추가했습니다!  
[예제 바로가기](https://github.com/solapi/solapi-nodejs/tree/master/examples/nextjs)

**전체 변경사항**: https://github.com/solapi/solapi-nodejs/compare/v5.3.1...v5.4.0

# 5.3.1 (2024년 5월 21일)

- RCS 발송 실패 시 일반 문자 대체 발송 예제 추가

# 5.3.0 (2024년 2월 8일)

- RCS 메시지 발송 및 예제 추가

# 5.2.4 (2023년 8월 29일)

- 알림톡, 친구톡 발송시 대체발송 기능 추가

# 5.2.3 (2023년 8월 29일)

- 알림톡, 친구톡 발송시 대체발송 기능 추가

# 5.2.3 (2023년 2월 3일)

- 수신 차단 그룹 별 수신번호 목록을 조회하실 수 있는 기능을 추가했습니다.
  - 예제가 추가되었습니다.
- 그룹 수신 차단 목록에 조회할 수 있는 항목 수가 늘어났습니다.
  - 각 검색 조건에 대한 예제와 설명이 추가되었습니다.

# 5.2.2 (2023년 2월 3일)

- 그룹 수신 차단 목록을 조회할 수 있는 기능을 추가했습니다.
  - 예제가 추가되었습니다.

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
