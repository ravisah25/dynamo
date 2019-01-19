'use strict'

const { getETag, createETag } = require('./etags')
const dynamoDb = require('./index')

test('Gets etag of given type', async () => {
  const record = {
    Item: {
      etag: "myetag"
    }
  }
  dynamoDb.get = jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve(record)
  }))

  try {
    const result = await getETag('organization')
    expect(result).toEqual("myetag")
  } catch (ex) {
    console.error(ex)
  }
})

test('Gets etag of given type Negative', async () => {
  dynamoDb.get = jest.fn().mockImplementation(() => ({
      promise: () => Promise.reject()
  }))

  try {
    const result = await getETag('organization')
    expect(result).toEqual(null)
  } catch (ex) {
    console.error(ex)
  }
})

test('Create etag of given type', async () => {
  dynamoDb.put = jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve()
  }))

  try {
    const result = await createETag('organization')
    expect(result).any(String)
  } catch (ex) {
    console.error(ex)
  }
})

test('Create etag of given type Negative', async () => {
  dynamoDb.put = jest.fn().mockImplementation(() => ({
      promise: () => Promise.reject("myError")
  }))

  try {
    await createETag('organization')
  } catch (ex) {
    expect(ex).toEqual("myError")
  }
})
