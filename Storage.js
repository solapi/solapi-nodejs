'use strict'

/**
 * @author Eden Cha <eden@nurigo.net>
 */

const qs = require('qs')
const { asyncRequest } = require('./utils')
const { getAuth, getUrl } = require('./config')

module.exports = class Storage {
  constructor (options = {}) {
    const { fileId } = options
    this.fileId = fileId
  }

  getFileId () {
    return this.fileId
  }

  setFileId (fileId) {
    this.fileId = fileId
  }

  /**
   * 파일 업로드
   *
   * @param {object} params - 서버 요청 시 사용되는 파라미터 입니다.
   * @example
   * // return promise object
   * Storage.upload({
   *  type: '파일 타입'
   * }).then(body => {
    * console.log(body)
   * })
   */
  upload (params = {}) {
    const { file, name, type, link } = params
    return asyncRequest('post', getUrl('/storage/v1/files'), {
      headers: { Authorization: getAuth() },
      form: { file, name, type, link }
    })
  }

  /**
   * 업로드 된 파일 조회
   *
   * @param {object} params - 서버 요청 시 사용되는 파라미터 입니다.
   * @example
   * // return promise object
   * Storage.get({
   *  fileId: '이미지 아이디 '
   * }).then(body => {
    * console.log(body)
   * })
   */
  get (params = {}) {
    const queryString = qs.stringify({ fileId: this.fileId, ...params })
    const uri = getUrl('/storage/v1/files')
    return asyncRequest('get', uri + (queryString ? '?' + queryString : ''), {
      headers: { Authorization: getAuth() }
    })
  }
}
