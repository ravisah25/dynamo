'use strict'

const {
  getSubjects,
  addSubject,
  addChapter,
  addTopic,
  deleteCurriculumRecord,
  getSubjectsWithKeys
} = require('./curriculum')
const dynamoDb = require('./index')

test('Get subjects', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve("mysubjects")
  }))

  try {
    const result = await getSubjects('key')
    expect(result).toEqual("mysubjects")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get subjects Negative', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("mysubjects")
  }))

  try {
    await getSubjects('key')
  } catch (ex) {
    expect(ex).toEqual("mysubjects")
  }
})

test('Get subjects with keys', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve("mysubjects")
  }))

  try {
    const result = await getSubjectsWithKeys('key')
    expect(result).toEqual("mysubjects")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get subjects with keys Negative', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("mysubjects")
  }))

  try {
    await getSubjectsWithKeys('key')
  } catch (ex) {
    expect(ex).toEqual("mysubjects")
  }
})

test('Create subjects', async () => {
  dynamoDb.put = jest.fn(() => ({ promise: () => Promise.resolve() }))

  try {
    await addSubject('key', 'data')
    expect(dynamoDb.put).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Create subjects Negative', async () => {
  dynamoDb.put = jest.fn(() => ({
    promise: () => Promise.reject("mysubjects")
  }))

  try {
    await addSubject('key', 'data')
  } catch (ex) {
    expect(ex).toEqual("mysubjects")
  }
})

test('Create chapters', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001'
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await addChapter('key', 'S001', 'chapters')
    expect(dynamoDb.update).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Create chapters Negative: Invalid subjects', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("myerror")
  }))

  try {
    await addChapter('key')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})

test('Create chapters Negative: Subject ids no match', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001'
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))

  try {
    await addChapter('key', 'S002', 'chapters')
  } catch (ex) {
    expect(ex).toEqual(new Error("No subject to update"))
  }
})

test('Create chapters Negative: Update fail', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001'
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.reject("myerror")
  }))

  try {
    await addChapter('key', 'S001', 'chapters')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})

test('Create Topics', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001',
        chapters: [{
          chapterId: 'CH001'
        }]
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await addTopic('key', 'S001', 'CH001', 'chapters')
    expect(dynamoDb.update).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Create Topics Negative: Invalid subjects', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("myerror")
  }))

  try {
    await addTopic('key', 'S001', 'CH001', 'chapters')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})

test('Create Topics Negative: Subject ids no match', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001'
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))

  try {
    await addTopic('key', 'S002', 'CH001', 'chapters')
  } catch (ex) {
    expect(ex).toEqual(new Error("No Subject with id: S002 to update"))
  }
})

test('Create Topics Negative: Chapter ids no match', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001',
        chapters: [{
          chapterId: 'CH001'
        }]
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))

  try {
    await addTopic('key', 'S001', 'CH002', 'chapters')
  } catch (ex) {
    expect(ex).toEqual(new Error("No Chapter with id: CH002 to update"))
  }
})

test('Create chapters Negative: Update fail', async () => {
  const record = {
    Item: {
      subjects: [{
        subjectId: 'S001',
        chapters: [{
          chapterId: 'CH001'
        }]
      }]
    }
  }
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve(record)
  }))
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.reject("myerror")
  }))

  try {
    await addChapter('key', 'S001', 'CH001', 'chapters')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})

test('Delete curriculum', async () => {
  dynamoDb.delete = jest.fn(() => ({ promise: () => Promise.resolve() }))

  try {
    await deleteCurriculumRecord('key')
    expect(dynamoDb.delete).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Delete curriculum Negative', async () => {
  dynamoDb.delete = jest.fn(() => ({ promise: () => Promise.reject("myerror") }))

  try {
    await deleteCurriculumRecord('key')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})
