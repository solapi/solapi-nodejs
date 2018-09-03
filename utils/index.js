'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const request = require('request')

function asyncRequest (method, uri, data) {
  return new Promise((resolve, reject) => {
    request[method](uri, data, (err, res) => {
      res.body = JSON.parse(res.body || '{}')
      if (err || res.statusCode !== 200) reject(err || res.body)
      resolve(res.body)
    })
  })
}

module.exports = {
  asyncRequest
}
