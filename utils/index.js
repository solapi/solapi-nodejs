'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const request = require('request')

function asyncRequest (method, uri, data) {
  return new Promise((resolve, reject) => {
    request[method](uri, data, (err, res) => {
      if (err) return reject(err)
      res.body = JSON.parse(res.body || '{}')
      if (res.statusCode !== 200) return reject(res.body)
      resolve(res.body)
    })
  })
}

module.exports = {
  asyncRequest
}
