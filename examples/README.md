# SOLAPI Node.js 예제 목록(JavaScript 기준)

## 환경 설정

### 웹훅 예제의 경우

```bash
cd webhooks
npm install
```

### 일반 예제의 경우

```bash
cd common
npm install
```

### 실행 방법

```bash
node ${실행 할 자바스크립트 파일}
```

## 발송 예제 목록

```text
./javascript/common/src/kakao/*   카카오 알림톡/친구톡 발송 예제
./javascript/common/src/sms/*     문자(SMS, LMS, MMS) 발송 예제
```

## 조회 예제(문자, 알림톡 등 통합)

```text
./javascript/common/src/inquiry/get_balance.js     잔액 조회 예제
./javascript/common/src/inquiry/get_messages.js    메시지 발송 현황 조회(대기 건 포함)
./javascript/common/src/inquiry/get_statistics.js  전체 통계 조회
```

## 기타

```text
./nextjs/* Next.js + SOLAPI SDK 연동 예제(UI)

# Next.js 예제만 확인해보고 싶다면 아래의 명령어를 입력해주세요!(npm 설치 필수)
npx degit solapi/solapi-nodejs/examples/nextjs#main sdk-test-app
```

```text
./javascript/webhooks/index.js 웹훅 그룹 리포트 예제
```
