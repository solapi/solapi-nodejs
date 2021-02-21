# SOLAPI SDK for Javascript
You can send text messages, Kakaotalk in Korea using this package.

## Installing
To use the SDK, simply use npm package manager CLI. Type the following into a terminal window.

### npm
```bash
npm install solapi
```
### yarn
```bash
yarn add solapi
```

## Usage

```javascript
const { config, msg } = require('../')

// apiKey, apiSecret 설정 (설정하지 않으면 패키지 홈의 config.json 파일의 설정을 참고합니다.)
config.init({
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})

async function send (params = {}) {
  try {
    const result = await msg.send(params)
    console.log('RESULT:', result)
  } catch (e) {
    console.log('statusCode:', e.statusCode)
    console.log('errorCode:', e.error.errorCode)
    console.log('errorMessage:', e.error.errorMessage)
  }
}

send({
  messages: [
    {
      to: '01000000001',
      from: '029302266',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.'
    },
    {
      to: '01000000002',
      from: '029302266',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    // ...
    // 1만건까지 추가 가능
  ]
})
```

## Examples

[NodeJS Examples](https://github.com/solapi/solapi-sdk-js-v4/tree/master/examples), 

[more examples can be found at solapi repos](https://github.com/solapi)
## Opening Issues

If you encounter a bug with the SOLAPI SDK for Javascript we would like to hear about it. Search the [existing issues](https://github.com/solapi/solapi-sdk-js-v4/issues) and try to make sure your problem doesn’t already exist before opening a new issue. It’s helpful if you include the version of the SDK, Node.js or browser environment and OS you’re using. Please include a stack trace and reduced repro case when appropriate, too.

## License

Licensed under the MIT License.
