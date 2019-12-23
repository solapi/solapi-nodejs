'use strict'

const config = require('./config')
const Group = require('./Group')
const Image = require('./Image')
const Storage = require('./Storage')

module.exports = {
  config,
  group: Group,
  Group,
  image: Image,
  Image,
  storage: Storage,
  Storage
}
