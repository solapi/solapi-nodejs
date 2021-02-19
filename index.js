'use strict'

const config = require('./config')
const msg = require('./lib/msg')
const Group = require('./lib/Group')
const Image = require('./lib/Image')
const Storage = require('./lib/Storage')

module.exports = {
  config,
  group: Group,
  Group,
  image: Image,
  Image,
  storage: Storage,
  Storage,
  msg
}
