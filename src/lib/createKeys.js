'use strict'

const crypto = require('crypto')

const formSubjectKey = (params) => {
  let subjectKey = ''
  if (params.hasOwnProperty('boardId') && params['boardId']) {
    subjectKey += params['boardId']
  } else {
    return ["boardId is empty", null]
  }

  if (params.hasOwnProperty('classId') && params['classId']) {
    subjectKey += ':' + params['classId']
  } else {
    return ["classId is empty", null]
  }

  if (params.hasOwnProperty('groupId') && params['groupId']) {  
    subjectKey += ':' + params['groupId']
  }

  return [null, subjectKey]
}

const getCurriculumKey = (params) => {

  if (!params) {
    return ["Invalid params to generate key", null]
  }

  let [err, subjectKey] = formSubjectKey(params)
  if (err) {
    return [err, subjectKey]
  }

  const hash = crypto.createHash('sha1')
  hash.update(subjectKey)
  subjectKey = hash.digest('hex')

  return [null, subjectKey]
}

const getContentKey = (params) => {

  if (!params) {
    return ["Invalid params to generate key", null]
  }

  const [err, subjectKey] = formSubjectKey(params)
  if (err) {
    return [err, subjectKey]
  }

  let contentKey = subjectKey
  
  if (params.hasOwnProperty('subjectId') && params['subjectId']) {
    contentKey += ':' + params['subjectId']
  } else {
    return ["subjectId is empty", null]
  }

  if (params.hasOwnProperty('chapterId') && params['chapterId']) {
    contentKey += ':' + params['chapterId']
  } else {
    return ["chapterId is empty", null]
  }

  if (params.hasOwnProperty('topicId') && params['topicId']) {
    contentKey += ':' + params['topicId']
  } else {
    return ["topicId is empty", null]
  }

  const hash = crypto.createHash('sha1')
  hash.update(contentKey)
  contentKey = hash.digest('hex')

  return [null, contentKey]
}

module.exports = {
  getCurriculumKey,
  getContentKey
}
