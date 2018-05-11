'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const os = require('os')
const qs = require('qs')
const { asyncRequest } = require('./utils')
const { getAuth } = require('./config')

module.exports = class Group {
  constructor (agent = {}) {
    if (!agent) throw new Error('agent는 object 타입 이어야 됩니다.')
    this.agent = agent
    this.agent.osPlatform = os.platform()
    this.agent.sdkVersion = 'JS 4.0.0'
  }
  async createGroup () {
    if (this.groupId) return
    this.groupData = await asyncRequest('post', 'https://rest.coolsms.co.kr/messages/v4/groups', { headers: { Authorization: getAuth() }, form: this.agent })
    this.groupId = this.groupData.groupId
  }
  async addGroupMessage (messages) {
    if (!Array.isArray(messages)) messages = [messages]
    messages = JSON.stringify(messages)
    const data = await asyncRequest('put', `https://rest.coolsms.co.kr/messages/v4/groups/${this.getGroupId()}/messages`, { headers: { Authorization: getAuth() }, form: { messages } })
    return data
  }
  async sendMessages () {
    const data = await asyncRequest('post', `https://rest.coolsms.co.kr/messages/v4/groups/${this.getGroupId()}/send`, { headers: { Authorization: getAuth() } })
    return data
  }
  async getMessageList (queryObject = { groupId: this.getGroupId() }) {
    const query = `?${qs.stringify(queryObject)}`
    const data = await asyncRequest('get', `https://rest.coolsms.co.kr/messages/v4/list${query}`, { headers: { Authorization: getAuth() } })
    return data
  }
  getGroupId () {
    if (!this.groupId) throw new Error('그룹을 생성하고 사용해주세요.')
    return this.groupId
  }
}
