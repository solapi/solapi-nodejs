'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const os = require('os')
const qs = require('qs')
const { asyncRequest } = require('./utils')
const { getAuth, getUrl } = require('./config')

module.exports = class Group {
  constructor ({ agent = {}, groupId } = {}) {
    if (!agent) throw new Error('agent는 object 타입 이어야 됩니다.')
    this.groupId = groupId
    this.agent = agent
    this.agent.osPlatform = os.platform()
    this.agent.sdkVersion = 'JS 4.0.0'
  }
  /**
   * 그룹 생성을 요청합니다.
   *
   * @example
   * // return promise object
   * const group = new Group()
   * group.createGroup().then(body => {
   *  console.log(body)
   * })
   */
  async createGroup () {
    if (this.groupId) return
    this.groupData = await asyncRequest('post', getUrl('/messages/v4/groups'), { headers: { Authorization: getAuth() }, form: this.agent })
    this.groupId = this.groupData.groupId
  }
  /**
   * 그룹에 메시지를 추가합니다.
   *
   * @param {object | array} messages - 추가될 메시지 객체
   * @example
   * // return promise object
   * group.addGroupMessage({
   *  to: 수신번호 (문서 참고)
   *  from: 발신번호
   *  text: 수신번호
   * })
   * @example
   * // return promise object
   * group.addGroupMessage([{
   *  to: 수신번호 (문서 참고)
   *  from: 발신번호
   *  text: 수신번호
   * }, {
   *  to: 수신번호 (문서 참고)
   *  from: 발신번호
   *  text: 수신번호
   * }]).then(body => {
   *  console.log(body)
   * })
   */
  addGroupMessage (messages) {
    if (!Array.isArray(messages)) messages = [messages]
    messages.forEach(message => {
      if (typeof message !== 'object') throw new Error('message 는 객체여야 합니다.')
      if (!message.autoTypeDetect && !message.type) throw new Error('autoTypeDetect 또는 type 을 입력해주세요.')
    })
    messages = JSON.stringify(messages)
    return asyncRequest('put', getUrl(`/messages/v4/groups/${this.getGroupId()}/messages`), { headers: { Authorization: getAuth() }, form: { messages } })
  }
  /**
   * 추가된 메시지들을 발송 요청합니다.
   *
   * @example
   * // return promise object
   * group.sendMessages().then(body => {
   *  console.log(body)
   * })
   */
  sendMessages () {
    return asyncRequest('post', getUrl(`/messages/v4/groups/${this.getGroupId()}/send`), { headers: { Authorization: getAuth() } })
  }
  /**
   * 그룹에 추가된 메시지들을 불러옵니다.
   *
   * @param {object} queryObject - 그룹에 추가된 메시지들을 불러옵니다. startKey, limit 의 값이 들어갈 수 있습니다.
   * @example
   * // return promise object
   * group.getMessageList().then(body => {
   *  console.log(body)
   * })
   */
  getMessageList (queryObject = { groupId: this.getGroupId() }) {
    const obj = {
      criteria: [],
      value: [],
      cond: [],
      startKey: queryObject.startKey || undefined,
      limit: queryObject.limit || 20
    }
    delete queryObject.startKey
    delete queryObject.limit
    Object.keys(queryObject).forEach(key => {
      obj.criteria.push(key)
      obj.value.push(queryObject[key])
      obj.cond.push('eq')
    })
    obj.criteria = obj.criteria.join(',')
    obj.value = obj.value.join(',')
    obj.cond = obj.cond.join(',')
    const query = `?${qs.stringify(obj)}`
    return asyncRequest('get', getUrl(`/messages/v4/list${query}`), { headers: { Authorization: getAuth() } })
  }

  /**
   * 그룹 삭제를 요청합니다.
   *
   * @param {string} groupId - 그룹아이디 입니다.
   * @example
   * // returns promise object
   * Group.deleteGroup(groupId).then(body => {
   *  console.log(body)
   * })
   */
  static deleteGroup (groupId) {
    return asyncRequest('delete', getUrl(`/messages/v4/groups/${groupId}`), { headers: { Authorization: getAuth() } })
  }
  /**
   * 그룹의 정보를 조회합니다.
   *
   * @param {string} groupId - 그룹아이디 입니다.
   * @example
   * // returns promise object
   * Group.getInfo(groupId).then(body => {
   *  console.log(body)
   * })
   */
  static async getInfo (groupId) {
    return asyncRequest('get', getUrl(`/messages/v4/groups/${groupId}`), { headers: { Authorization: getAuth() } })
  }

  /**
   * 자신의 그룹 목록을 불러옵니다.
   *
   * @example
   * // return promise object
   * Group.getMyGroupList().then(body => {
   *  console.log(body)
   * })
   */
  static async getMyGroupList (query) {
    query = qs.stringify(query)
    return asyncRequest('get', getUrl(`/messages/v4/groups?${query}`), { headers: { Authorization: getAuth() } })
  }

  /**
   * 등록된 그룹의 메시지를 삭제합니다
   */
  async deleteGroupMessages (messageId) {
    return asyncRequest('delete', getUrl(`/messages/v4/groups/${this.getGroupId()}/messages`), { headers: { Authorization: getAuth() }, form: { messageIds: [messageId] } })
  }

  /**
   * 그룹 생성, 메시지 추가, 발송
   * 3 번의 요청에서 1 번의 요청으로 줄일 수 있는 기능입니다.
   *
   * @param {object} message - 메시지의 내용을 담은 객체입니다. 필수로 존재해야 하는 값은 to, from, text 입니다.
   * @param {object} agent - 사용하는 앱의 정보를 담은 객체입니다. 자신의 앱을 사용중이라면, 값을 넣지 않아도 됩니다.
   *
   * @example
   * // return promise object
   * Group.sendSimpleMessage({
   *  to: '수신번호',
   *  from: '발신번호',
   *  text: '문자메시지 내용'
   * }).then(body => {
    * console.log(body)
   * })
   */
  static sendSimpleMessage (message = {}, agent = {}) {
    if (typeof message !== 'object') throw new Error('message 는 객체여야 합니다.')
    if (!message.autoTypeDetect && !message.type) throw new Error('autoTypeDetect 또는 type 을 입력해주세요.')
    return asyncRequest('post', getUrl(`/messages/v4/send`), { headers: { Authorization: getAuth() }, form: { message, agent } })
  }
  getGroupId () {
    if (!this.groupId) throw new Error('그룹을 생성하고 사용해주세요.')
    return this.groupId
  }
}
