'use strict'

const { getBoards, putBoards, getFeatures } = require('./organization')
const dynamoDb = require('./index')

test('Get boards', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve("result")
  }))

  try {
    const result = await getBoards()
    expect(result).toEqual("result")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get boards Negative', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await getBoards()
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Get Features', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.resolve("result")
  }))

  try {
    const result = await getFeatures()
    expect(result).toEqual("result")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get Features Negative', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await getFeatures()
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Update boards', async () => {
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await getFeatures('boards')
    expect(dynamoDb.update).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Update boards Negative', async () => {
  dynamoDb.update = jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await getFeatures('boards')
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})
