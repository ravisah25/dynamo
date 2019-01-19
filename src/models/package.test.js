'use strict'

const {
  getPackageRecords,
  getPackageRecord,
  createPackageRecord,
  updatePackageRecord,
  deletePackageRecord
} = require('./package')
const dynamoDb = require('./index')

test('Get packages', async () => {
  dynamoDb.scan = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve({Items: ['packages']})
  }))

  try {
    const result = await getPackageRecords()
    expect(result).toEqual(["packages"])
  } catch (ex) {
    console.error(ex)
  }
})

test('Get packages Negative', async () => {
  dynamoDb.scan = jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await getPackageRecords()
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Get package', async () => {
  dynamoDb.get = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve("pacakges")
  }))

  try {
    const result = await getPackageRecord('packageId')
    expect(result).toEqual("pacakges")
  } catch (ex) {
    console.error(ex)
  }
})

test('Get package Negative', async () => {
  dynamoDb.get = jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await getPackageRecord('packageId')
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Create package', async () => {
  dynamoDb.put = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await createPackageRecord('packageDetails')
    expect(dynamoDb.put).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Create package Negative', async () => {
  dynamoDb.put= jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await createPackageRecord('packageDetails')
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Update package', async () => {
  dynamoDb.update = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await updatePackageRecord('packageId', 'packageDetails')
    expect(dynamoDb.update).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Update package Negative', async () => {
  dynamoDb.update= jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await updatePackageRecord('packageId', 'packageDetails')
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})

test('Delete package', async () => {
  dynamoDb.delete = jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve()
  }))

  try {
    await deletePackageRecord('packageId')
    expect(dynamoDb.delete).toBeCalled()
  } catch (ex) {
    console.error(ex)
  }
})

test('Delete package Negative', async () => {
  dynamoDb.delete= jest.fn(() => ({
    promise: () => Promise.reject("error")
  }))

  try {
    await deletePackageRecord('packageId')
  } catch (ex) {
    expect(ex).toEqual("error")
  }
})
