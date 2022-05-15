# SOLAPI SDK for Node.js(Server Side Only)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsolapi%2Fsolapi-nodejs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsolapi%2Fsolapi-nodejs?ref=badge_shield)


You can send text messages(SMS, LMS, MMS), Kakao friendtalk(include notification friendtalk) in Korea using this package.  

## Installing

To use the SDK, simply use npm package manager CLI. Type the following into a terminal window.

### npm

```bash
npm install --save solapi
```

### yarn

```bash
yarn add solapi
```

## Usage

### JavaScript
```javascript
const solapi = require('solapi').default;

// apiKey, apiSecret 설정
const messageService = new solapi('ENTER_YOUR_API_KEY', 'ENTER_YOUR_API_SECRET');

// 2건 이상의 메시지를 발송할 때는 sendMany, 단일 건 메시지 발송은 sendOne을 이용해야 합니다. 
messageService.sendMany([
    {
      to: '01000000001',
      from: '01012345678',
      text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.'
    },
    {
      to: '01000000002',
      from: '01012345678',
      text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    // 1만건까지 추가 가능
  ]).then(res => console.log(res))
  .catch(err => console.error(err));
```

## Opening Issues

If you encounter a bug with the SOLAPI SDK for Javascript we would like to hear about it. Search
the [existing issues](https://github.com/solapi/solapi-nodejs/issues) and try to make sure your problem doesn’t
already exist before opening a new issue. It’s helpful if you include the version of the SDK, Node.js or browser
environment and OS you’re using. Please include a stack trace and reduced repro case when appropriate, too.

## License

Licensed under the MIT License.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsolapi%2Fsolapi-nodejs.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsolapi%2Fsolapi-nodejs?ref=badge_large)