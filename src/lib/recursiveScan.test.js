'use strict'

const { recursiveScan } = require('./recursiveScan')
const dynamoDb = require('../models')

test('Recursive scan', async () => {
  dynamoDb.scan = jest.fn(() => ({
    promise: () => Promise.resolve({Items: ['records']})
  }))
  try {
    const result = await recursiveScan(dynamoDb, 'params')
    expect(result).toEqual(['records'])
  } catch (ex) {
    console.error(ex)
  }
})

test('Recursive scan LastEvaluatedKey', async () => {
  dynamoDb.scan = jest.fn((params) => {
    return { promise: () => Promise.resolve({
      Items: ['records'],
      LastEvaluatedKey: params.ExclusiveStartKey ? null : 'lastkey'
    })
  }})
  try {
    const result = await recursiveScan(dynamoDb, {})
    expect(result).toEqual(['records'])
  } catch (ex) {
    console.error(ex)
  }
})

test('Recursive scan Negative', async () => {
  dynamoDb.scan = jest.fn(() => ({
    promise: () => Promise.reject("myerror")
  }))
  try {
    await recursiveScan(dynamoDb, 'params')
  } catch (ex) {
    expect(ex).toEqual("myerror")
  }
})
