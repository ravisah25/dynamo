'use strict'

const { getContent, addContent,
  deleteContentRecord, updateContent,
  getKeysWithParentId
} = require('./content')
const dynamoDb = require('./index')

test('Get content for a topic', async () => {
  dynamoDb.get = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve("mycontent")
  }))

  try {
    const result = await getContent('key')
    expect(result).toBe("mycontent")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get content for a topic Negative', async () => {
  dynamoDb.get = jest.fn().mockImplementation(() => ({
    promise: () => Promise.reject("mycontent")
  }))

  try {
    await getContent('key')
  } catch (ex) {
    expect(ex).toBe("mycontent")
  }
})

test('Create content for a topic', async () => {
  dynamoDb.put = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve("mycontent")
  }))

  try {
    await addContent('key', 'data')
    expect(dynamoDb.put).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Create content for a topic Negative', async () => {
  dynamoDb.put = jest.fn().mockImplementation(() => ({
    promise: () => Promise.reject("mycontent")
  }))

  try {
    await addContent('key', 'data')
  } catch (ex) {
    expect(ex).toBe("mycontent")
  }
})

test('Update content for a topic', async () => {
  dynamoDb.update = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve("mycontent")
  }))

  try {
    await updateContent('key', 'data')
    expect(dynamoDb.update).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Update content for a topic Negative', async () => {
  dynamoDb.update = jest.fn().mockImplementation(() => ({
    promise: () => Promise.reject("mycontent")
  }))

  try {
    await updateContent('key', 'data')
  } catch (ex) {
    expect(ex).toBe("mycontent")
  }
})

test('delete content for a topic', async () => {
  dynamoDb.delete = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve("mycontent")
  }))

  try {
    await deleteContentRecord('key')
    expect(dynamoDb.delete).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('delete content for a topic Negative', async () => {
  dynamoDb.delete = jest.fn().mockImplementation(() => ({
    promise: () => Promise.reject("mycontent")
  }))

  try {
    await deleteContentRecord('key')
  } catch (ex) {
    expect(ex).toBe("mycontent")
  }
})

test('getkeyswithparentid content for a topic', async () => {
  dynamoDb.scan = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve({Items: ['item']})
  }))
  try {
    const result = await getKeysWithParentId('key', 'data')
    expect(result).toEqual(['item'])
  } catch (ex) {
    console.error(ex)
  }
})

test('getkeyswithparentid content for a topic Negative', async () => {
  dynamoDb.scan = jest.fn().mockImplementation(() => ({
    promise: () => Promise.reject("mycontent")
  }))

  try {
    await getKeysWithParentId('key', 'data')
  } catch (ex) {
    expect(ex).toBe("mycontent")
  }
})
