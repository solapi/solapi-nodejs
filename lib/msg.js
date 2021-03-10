'use strict'

const libpath = require('path')
const request = require('request-promise')
const image2base64 = require('image-to-base64')
const { getAuth, getUrl } = require('../config')

module.exports.send = (body) => {
  return request({
    method: 'POST',
    uri: getUrl(`/messages/v4/send-many`),
    headers: { Authorization: getAuth() },
    body,
    json: true
  })
}

module.exports.get_messages = (qs = {}) => {
  return request({
    method: 'GET',
    uri: getUrl(`/messages/v4/list`),
    headers: { Authorization: getAuth() },
    qs,
    json: true
  })
}

/**
 * @param body.file (required) 파일 내용을 Base64로 인코딩한 문자열
 * @param body.type (reuqired) MMS: 200K이하의 JPG, KAKAO: 500K 이하의 JPG, PNG, DOCUMENT: 2MB이하의 JPG, PNG, PDF, TIFF
 * @param body.name (optional) 파일 이름
 * @param body.link (optional) type이 KAKAO일 때 링크 URL
 */
const upload = (body) => {
  return request({
    method: 'POST',
    uri: getUrl(`/storage/v1/files`),
    headers: { Authorization: getAuth() },
    body,
    json: true
  })
}

/**
 * MMS 이미일 파일 업로드
 * @param path 업로드할 파일경로
 */
module.exports.uploadMMSImage = async (path) => {
  return upload({
    file: await image2base64(path),
    type: 'MMS'
  })
}

/**
 * 카카오 이미일 파일 업로드
 * @param path 업로드할 파일경로
 * @param link 이미지 클릭시 이동할 URL
 */
module.exports.uploadKakaoImage = async (path, link) => {
  return upload({
    file: await image2base64(path),
    type: 'KAKAO',
    name: libpath.basename(path),
    link
  })
}
