'use strict'

const { preCreateCurriculumKeys } = require('../lib/precreate')
const dynamoDb = require('./index')
const CURRICULUM_TABLE = process.env.CURRICULUM_TABLE

const getSubjects = async (subjectKey) => {

  const params = {
    TableName: CURRICULUM_TABLE,
    Key: {
      subjectKey: subjectKey
    },
    ProjectionExpression: 'subjects'
  }

  try {
    return await dynamoDb.get(params).promise()
  } catch(ex) {
    throw ex
  }

}

const getSubjectsWithKeys = async (subjectKey) => {
  const params = {
    TableName: CURRICULUM_TABLE,
    Key: {
      subjectKey: subjectKey
    }
  }

  try {
    return await dynamoDb.get(params).promise()
  } catch(ex) {
    throw ex
  }
}

const addSubject = async (subjectKey, data) => {

  const preItem = preCreateCurriculumKeys(data)

  const params = {
    TableName: CURRICULUM_TABLE,
    Item: {
      subjectKey: subjectKey,
      subjects: data.subjects,
      ...preItem
    }
  }

  try {
    await dynamoDb.put(params).promise()
  } catch(ex) {
    throw ex
  }

}

const addChapter = async (subjectKey, subjectId, chapters) => {
  
  let sIndex
  try {
    const record = await getSubjects(subjectKey)
    const subject = record.Item.subjects.find(subject => (
      subject.subjectId === subjectId
    ))

    sIndex = record.Item.subjects.indexOf(subject)
    if (typeof sIndex === undefined || sIndex === -1) {
      console.error("No subject to update")
      throw new Error('No subject to update')
    }
  } catch(ex) {
    console.error(ex)
    throw ex
  }

  const updateQuery = `set subjects[${sIndex}].chapters = :chapters`
  const params = {
    TableName: CURRICULUM_TABLE,
    Key: {
      subjectKey: subjectKey
    },
    UpdateExpression: updateQuery,
    ExpressionAttributeValues: {
      ':chapters': chapters
    },
    ReturnValues:"UPDATED_NEW"
  }

  try {
    return await dynamoDb.update(params).promise()
  } catch(ex) {
    throw ex
  }
}

const addTopic = async (subjectKey, subjectId, chapterId, topics) => {

  let sIndex, cIndex
  try {
    const record = await getSubjects(subjectKey)
    const subject = record.Item.subjects.find(subject => (
      subject.subjectId === subjectId
    ))
    sIndex = record.Item.subjects.indexOf(subject)
    if (typeof sIndex === undefined || sIndex === -1) {
      console.error("No subject to update")
      throw new Error(`No Subject with id: ${subjectId} to update`)
    }

    const chapter = subject.chapters.find(chapter => (
      chapter.chapterId === chapterId
    ))
    cIndex = subject.chapters.indexOf(chapter)
    if (typeof cIndex === undefined || cIndex === -1) {
      console.error("No chapter to update")
      throw new Error(`No Chapter with id: ${chapterId} to update`)
    }
  } catch(ex) {
    console.error(ex)
    throw ex
  }

  const updateQuery = `set subjects[${sIndex}].chapters[${cIndex}].topics = :topics`
  const params = {
    TableName: CURRICULUM_TABLE,
    Key: {
      subjectKey: subjectKey
    },
    UpdateExpression: updateQuery,
    ExpressionAttributeValues: {
      ':topics': topics
    },
    ReturnValues:"UPDATED_NEW"
  }

  try {
    return await dynamoDb.update(params).promise()
  } catch(ex) {
    throw ex
  }

}

const deleteCurriculumRecord = async (subjectKey) => {
  const params = {
    TableName: CURRICULUM_TABLE,
    Key: {
      subjectKey: subjectKey
    }
  }
  
  try {
    return dynamoDb.delete(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

module.exports = {
  getSubjects,
  addSubject,
  addChapter,
  addTopic,
  deleteCurriculumRecord,
  getSubjectsWithKeys
}
