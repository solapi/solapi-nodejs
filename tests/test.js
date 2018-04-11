/* global describe, it */

const { group, simple, image, list } = require('../')

describe('test', () => {
  it('group', async () => {
    await group()
  })
  it('simple', async () => {
    await simple()
  })
  it('image', async () => {
    await image()
  })
  it('list', async () => {
    await list()
  })
})
