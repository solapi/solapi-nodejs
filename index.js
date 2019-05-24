'use strict'

const config = require('./config')
const Group = require('./Group')
const Image = require('./Image')

module.exports = {
  config,
  group: Group,
  Group,
  image: Image,
  Image
}
