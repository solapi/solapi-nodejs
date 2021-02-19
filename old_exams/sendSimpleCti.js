const path = require('path')
const image2base64 = require('image-to-base64')
const { config, Group, Storage } = require('../')
config.init({
  apiKey: 'ENTER_YOUR_API_KEY',
  apiSecret: 'ENTER_YOUR_API_SECRET'
})
const options = {
  imagePath: path.join(__dirname, '/source/tmp_img.png')
}
const storageParams = {
  // https://solapi.com/storage
  fileId: 'ENTER_YOUR_FILE_ID',
  name: 'ENTER_YOUR_IMAGE_NAME',
  link: 'ENTER_YOUR_IMAGE_LINK',
  type: 'KAKAO'
}
const messageParams = {
  type: 'CTI',
  subject: 'this is CTI',
  text: 'Hello, this is CTI',
  to: '수신 번호',
  from: '발신 번호',
  kakaoOptions: {
    disableSms: true,
    // https://solapi.com/kakao/plus-friends
    pfId: 'ENTER_YOUR_PFID',
    imageId: storageParams.fileId,
    buttons: [
      {
        buttonName: '홈페이지',
        buttonType: 'WL',
        linkMo: 'https://solapi.com',
        linkPc: 'https://solapi.com'
      },
      {
        buttonName: '회원가입',
        buttonType: 'WL',
        linkMo: 'https://solapi.com/signup',
        linkPc: 'https://solapi.com/signup'
      }
    ]
  }
}

// send CTI (친구톡 이미지)
const { fileId } = storageParams
const storage = new Storage({ fileId })
main()

async function main () {
  try {
    const { fileList = [] } = await getImages({ fileId: storage.getFileId() })
    const image = fileList[0] || {}
    if (!image.fileId) {
      const { imagePath } = options
      const { type, name, link } = storageParams
      const imageOptions = { type, name, link }
      const response = await uploadImage(imagePath, imageOptions)
      storage.setFileId(response.fileId)
    }
    messageParams.kakaoOptions.imageId = storage.getFileId()
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
