## 발신번호 등록

Step 1) 발신번호를 등록(생성)합니다.
create_number.js 파일의 phoneNumber 변수값을 발신번호로 사용할 전화번호로 입력해 주세요.

```
> vi create_number.js   (phoneNumber 수정)
> node create_number.js
```

## 발신번호 인증

Step 2) 전화번호 인증
 * 해당 전화번호로 전화를 걸어 인증번호를 알려줍니다.
 * 리턴되는 Transaction ID와 인증번호(Token)를 기록해두어 다음 Step에서 사용합니다.

```
> vi request_voicecall.js  (phoneNumber 수정)
> node request_voicecall.js
```

Step 3) 인증번호 확인
Trasaction ID 와 인증번호로 인증을 확인합니다.

```
> vi verify_token.js (phoneNumber, transactionId, token 수정)
> node verify_token.js 
```

## 활성화된 발신번호 조회
Step 3 까지 진행했을 때 특별한 오류가 없었다면 활성화된 발신번호 목록에서 확인 가능합니다.
```
> node active_numbers.js
```
