'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const moment = require('moment')
const uniqid = require('uniqid')
const HmacSHA256 = require('crypto-js/hmac-sha256')
const fs = require('fs')
const path = require('path')
const config = fs.existsSync(path.join(__dirname, '/config.json')) ? require('./config.json') : {}
let { apiKey = process.env.API_KEY || '', apiSecret = process.env.API_SECRET || '', accessToken = process.env.ACCESS_TOKEN || '', phoneNumber = process.env.PHONE_NUMBER || '01000000000' } = config
console.log(apiKey)
module.exports = {
  getAuth (headerType = getHeaderType()) {
    switch (headerType) {
      case 1:
        const date = moment.utc().format()
        const salt = uniqid()
        const hmacData = date + salt
        const signature = HmacSHA256(hmacData, apiSecret).toString()
        return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
      case 2:
        return `Bearer ${accessToken}`
      default:
        throw new Error('문자메시지를 전송하기 위해서는 액세스토큰 또는 API_KEY, API_SECRET이 필요합니다.')
    }
  },
  getPhoneNumber () {
    return phoneNumber
  },
  init (config) {
    apiKey = config.apiKey
    apiSecret = config.apiSecret
    accessToken = config.accessToken
    phoneNumber = config.accessToken
  }
}

function getHeaderType () {
  if (apiKey && apiSecret) return 1
  else if (accessToken) return 2
  return 0
}
