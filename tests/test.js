/* global describe, it */
'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const { expect } = require('chai')
const { group: Group } = require('../')
const { getAuth, getTo, getFrom } = require('../config')

describe('test', () => {
  describe('config', () => {
    it('API_KEY, API_SECRET 검사', done => {
      expect(getAuth(1)).to.match(/^HMAC-SHA256/)
      done()
    })
    it('ACCESS_TOKEN 검사', done => {
      expect(getAuth(2)).to.match(/^Bearer/)
      done()
    })
    it('default 검사', done => {
      try {
        getAuth(0)
      } catch (err) {
        expect(err.message).to.equal('문자메시지를 전송하기 위해서는 액세스토큰 또는 API_KEY, API_SECRET이 필요합니다.')
        done()
      }
    })
  })
  describe('group', () => {
    it('그룹 생성 (그룹 아이디 확인)', async () => {
      const group = new Group()
      await group.createGroup()
      expect(group.getGroupId()).to.not.equal(undefined)
    })
    it('그룹 메시지 추가 (none message)', async () => {
      const group = new Group()
      try {
        await group.addGroupMessage()
      } catch (err) {
        expect(err.message).to.equal('message 는 객체여야 합니다.')
        group.err = err
      }
      expect(group.err).to.not.equal(undefined)
    })
    it('그룹 메시지 추가 (none autoTypeDetect and type)', async () => {
      const group = new Group()
      try {
        await group.addGroupMessage({})
      } catch (err) {
        expect(err.message).to.equal('autoTypeDetect 또는 type 을 입력해주세요.')
        group.err = err
      }
      expect(group.err).to.not.equal(undefined)
    })
    it('그룹 메시지 추가 (그룹 생성 전)', async () => {
      const group = new Group()
      try {
        await group.addGroupMessage({
          type: 'SMS'
        })
      } catch (err) {
        expect(err.message).to.equal('그룹을 생성하고 사용해주세요.')
        group.err = err
      }
      expect(group.err).to.not.equal(undefined)
    })
    it('그룹 메시지 추가 (배열로)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.addGroupMessage([{
        to: '01000000000',
        from: '01000000000',
        text: 'TEST',
        type: 'SMS'
      }, {
        to: '01000000000',
        from: '01000000000',
        text: 'TEST',
        type: 'SMS'
      }])
      expect(data.errorCount).to.equal(2)
    })
    it('그룹 메시지 추가 (오브젝트로)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.addGroupMessage({
        to: '01000000000',
        from: '01000000000',
        text: 'TEST',
        type: 'SMS'
      })
      expect(data.errorCount).to.equal(1)
    })
    let tempGroup
    it('그룹 메시지 발송 (성공)', async () => {
      const group = new Group()
      tempGroup = group
      await group.createGroup()
      const data = await group.addGroupMessage({
        to: getTo(),
        from: getFrom(),
        text: 'TEST',
        type: 'SMS'
      })
      expect(data.errorCount).to.equal(0)
      const result = await group.sendMessages()
      expect(result).to.have.all.keys('app', 'balance', 'countForCharge', 'dateCompleted', 'dateSent', 'isRefunded', 'osPlatform', 'point', 'price', 'sdkVersion', 'count', 'log', 'status', '_id', 'groupId', 'accountId', 'apiVersion', 'dateCreated', 'dateUpdated', 'flagUpdated')
    })
    it('그룹 삭제 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await Group.deleteGroup(group.getGroupId())
      expect(data.log[1].message).to.match(/삭제/)
    })
    it('그룹 삭제 (PENDING 이 아닌경우)', async () => {
      let data = {}
      try {
        await Group.deleteGroup(tempGroup.getGroupId())
      } catch (err) {
        data = err
      }
      expect(data.errorCode).to.equal('NotOperationalStatus')
    })
    it('그룹 정보 조회 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await Group.getInfo(group.getGroupId())
      expect(data).to.have.all.keys('app', 'balance', 'countForCharge', 'dateCompleted', 'dateSent', 'isRefunded', 'osPlatform', 'point', 'price', 'sdkVersion', 'count', 'log', 'status', '_id', 'groupId', 'accountId', 'apiVersion', 'dateCreated', 'dateUpdated', 'flagUpdated')
    })
    it('그룹 정보 조회 (생성 전)', async () => {
      const group = new Group()
      let data = {}
      try {
        await Group.getInfo(group.getGroupId())
      } catch (err) {
        data = err
      }
      expect(data.message).to.equal('그룹을 생성하고 사용해주세요.')
    })
    it('그룹 목록 조회 (성공)', async () => {
      const groupList = await Group.getMyGroupList()
      expect(groupList).to.have.all.keys('startKey', 'limit', 'groupList', 'nextKey')
    })
  })
  describe('message', () => {
    it('메시지 리스트 조회 (그룹 생성 전)', async () => {
      const group = new Group()
      let data = {}
      try {
        await group.getMessageList()
      } catch (err) {
        data = err
      }
      expect(data.message).to.equal('그룹을 생성하고 사용해주세요.')
    })
    it('메시지 리스트 조회 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      await group.addGroupMessage({
        to: getTo(),
        from: getFrom(),
        text: 'TEST',
        type: 'SMS'
      })
      await group.addGroupMessage({
        to: getTo(),
        from: getFrom(),
        text: 'TEST',
        type: 'SMS'
      })
      const data = await group.getMessageList()
      expect(Object.keys(data.messageList)).to.have.lengthOf(2)
    }).timeout(20000)
    it('심플 메시지 (정상)', async () => {
      expect(await Group.sendSimpleMessage({
        to: getTo(),
        from: getFrom(),
        text: 'TEST',
        type: 'SMS'
      })).to.have.all.keys('groupId', 'to', 'from', 'type', 'statusMessage', 'messageId', 'statusCode', 'accountId', 'country')
    })
  })
})
