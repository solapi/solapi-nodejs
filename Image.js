'use strict'

/**
 * @author Billy Kang <billy@nurigo.net>
 */

const { asyncRequest } = require('./utils')
const { getAuth } = require('./config')

module.exports = class Image {
  constructor(image, type = 'MMS') {
    this.imageId = null
    this.image = image
    this.type = type // MMS or KAKAO
  }
  /**
   * 이미지 생성을 요청합니다.
   *
   * @example
   * // return promise object
   * const image = new Image()
   * image.createImage().then(body => {
   *  console.log(body)
   * })
   */
  async createImage () {
    this.imageData = await asyncRequest(
      'post',
      'https://api.solapi.com/storage/v1/files',
      {
        headers: { Authorization: getAuth() },
        form: { file: this.file, type: this.type }
      }
    )
    this.imageId = this.imageData.imageId
    return this.imageId
  }

  getImageId() {
    if (!this.imageId) throw new Error('아직 생성된 이미지가 없습니다.')
    return this.imageId
  }
}
