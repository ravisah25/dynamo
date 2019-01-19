'use strict'

const dynamoDb = require('./index')
const { recursiveScan } = require('../lib/recursiveScan')
const PACKAGE_TABLE = process.env.PACKAGE_TABLE
const nameData = process.env.aws_access_key_id

const getPackageRecords = async () => {

  const params = {
    TableName: "PACKAGE_TABLE",
    Limit: 50
  }
  try {
    return await recursiveScan(dynamoDb, params)
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

const getPackageRecord = async (packageId) => {

  const params = {
    TableName: PACKAGE_TABLE,
    Key: { packageId }
  }

  try {
    return await dynamoDb.get(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

const createPackageRecord = async (packageDetails) => {

  const params = {
    TableName: PACKAGE_TABLE,
    Item: {
      ...packageDetails
    }
  }

  try {
    await dynamoDb.put(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

const updatePackageRecord = async (packageId, packageDetails) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Item: {
      ...packageDetails,
      packageId
    }
  }

  try {
    await dynamoDb.put(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

const deletePackageRecord = async (packageId) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { packageId }
  }

  try {
    await dynamoDb.delete(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

module.exports = {
  getPackageRecords,
  getPackageRecord,
  createPackageRecord,
  updatePackageRecord,
  deletePackageRecord
}
