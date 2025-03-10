# Next.js + SOLAPI SDK 예제

## 예제를 내려받았을 때 최초 실행 동작

예제를 내려받은 직후에는 아래와 같은 명령어를 입력해서 node_modules를 설치해주세요!

```shell
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

1. node_modules를 설치한 후에는 .env.example 파일을 .env로 변경해주세요!
2. 바꾼 .env 파일로 들어가서 SOLAPI_API_KEY와 SOLAPI_API_SECRET의 값을 실제 사용하실 API Key, API Secret Key로 변경해주세요!

```text
// .env
SOLAPI_API_KEY=YOUR_API_KEY_HERE
SOLAPI_API_SECRET=YOUR_API_SECRET_KEY_HERE
```

## 실행해보기!

실행을 위해 터미널 환경에서 아래와 같은 명령어를 입력해주세요!

```shell
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# 이후 localhost:3000 으로 접속해서 테스트를 진행하실 수 있습니다!
```
## 주의사항

* 반드시 .env 파일에 등록 및 활성화하신 API Key, API Secret Key를 설정하셔야 합니다! 설정하지 않을 경우 실제 실행 시 표시되는 apiKey, apiSecret 폼을 입력하여 테스트해보실 수 있습니다.
* 본 예제는 Node.js 18.18 버전 이상을 호환하는 [Next.js 15.2.1](https://nextjs.org/docs/app/getting-started/installation) 버전으로 만들어졌습니다. 반드시 Node.js 18.18 이상의 버전으로 진행해주세요!  
