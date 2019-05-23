'use strict'

/**
 * @author Billy Kang <billy@nurigo.net>
 */

const { asyncRequest } = require('./utils')
const { getAuth } = require('./config')

module.exports = class Image {
  constructor (image) {
    this.imageId = null
    this.image = image
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
      'https://rest.coolsms.co.kr/images/v4/images',
      { headers: { Authorization: getAuth() }, form: this.image }
    )
    this.imageId = this.imageData.imageId
    return this.imageId
  }
  getImageId () {
    if (!this.imageId) throw new Error('아직 생성된 이미지가 없습니다.')
    return this.imageId
  }
}
