const path = require('path')
const image2base64 = require('image-to-base64')
const { config, Group, Storage } = require('../')
config.init({
  // https://solapi.com/credentials
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})
const options = {
  imagePath: path.join(__dirname, '/source/tmp_img.png')
}
const storageParams = {
  // https://solapi.com/storage
  fileId: 'ENTER_YOUR_FILE_ID',
  type: 'MMS'
}
const messageParams = {
  type: 'MMS',
  subject: 'this is MMS',
  text: 'Hello, this is MMS',
  to: '수신 번호',
  // https://solapi.com/senderids
  from: '발신 번호',
  imageId: storageParams.fileId
}

// send MMS (멀티미디어메시지)
const { fileId } = storageParams
const storage = new Storage({ fileId })
main()

async function main () {
  try {
    const { fileList = [] } = await getImages({ fileId: storage.getFileId() })
    const image = fileList[0] || {}
    if (!image.fileId) {
      const { imagePath } = options
      const { type } = storageParams
      const imageOptions = { type }
      const response = await uploadImage(imagePath, imageOptions)
      storage.setFileId(response.fileId)
    }
    messageParams.imageId = storage.getFileId()
    const response = await send(messageParams)
    console.info(response)
  } catch (error) {
    console.error(error)
  }
}

function uploadImage (path, params) {
  return new Promise((resolve, reject) => {
    image2base64(path).then(file => {
      storage
        .upload({ file, ...params })
        .then(resolve)
        .catch(reject)
    })
  })
}

function getImages (params) {
  return new Promise((resolve, reject) => {
    storage
      .get(params)
      .then(resolve)
      .catch(reject)
  })
}

function send (params, agent = {}) {
  return Group.sendSimpleMessage(params, agent)
}
