'use strict'

const crypto = require('crypto')
const { getCurriculumKey, getContentKey } = require('./createKeys')

const currInput = {
  boardId: 'B001',
  classId: 'C001',
  groupId: 'G001',
}

const contentInput = {
  ...currInput,
  subjectId: 'S001',
  chapterId: 'CH001',
  topicId: 'T001'
}

test('Generate curriculum key', () => {
  const keyStr = `${currInput.boardId}:${currInput.classId}:${currInput.groupId}`
  const result = crypto.createHash('sha1').update(keyStr).digest('hex')
  expect(getCurriculumKey(currInput)).toEqual([null, result])
})

test('Generate content key', () => {
  const keyStr = `${contentInput.boardId}:${contentInput.classId}:${contentInput.groupId}:${contentInput.subjectId}:${contentInput.chapterId}:${contentInput.topicId}`
  const result = crypto.createHash('sha1').update(keyStr).digest('hex')
  expect(getContentKey(contentInput)).toEqual([null, result])
})
