const image2base64 = require('image-to-base64')
const { config, Group, Image } = require('../')
config.init({
  apiKey: 'ENTER API_KEY',
  apiSecret: 'ENTER API_SECRET'
})

sendMMS({
  type: 'MMS',
  subject: 'this is MMS',
  text: 'Hello, this is MMS',
  to: '수신 번호',
  from: '발신 번호',
  imagePath: __dirname + '/source/tmp_img.png'
})

function uploadImage (path, type = 'MMS') {
  return new Promise((resolve, reject) => {
    image2base64(path)
      .then(result => {
        const image = new Image(result, type)
        image
          .createImage()
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}

async function sendMMS (message, agent = {}) {
  const { imagePath, ...params } = message
  try {
    const imageId = await uploadImage(imagePath)
    const response = await Group.sendSimpleMessage(
      { imageId, ...params },
      agent
    )
    console.info(response)
  } catch (error) {
    console.error(error)
  }
}
