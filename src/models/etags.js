'use strict'

const uuidv1 = require('uuid/v1')
const dynamoDb = require('./index')

const ETAGS_TABLE = process.env.ETAGS_TABLE

const getETag = async (etagType) => {

  const params = {
    TableName: ETAGS_TABLE,
    Key: {
      etagType: etagType
    },
    ProjectionExpression : 'etag'
  }

  try {
    const record = await dynamoDb.get(params).promise()
    return record.Item.etag
  } catch(ex) {
    console.error(ex)
    return null
  }

}

const createETag = async (etagType) => {

  const key = uuidv1()
  const params = {
    TableName: ETAGS_TABLE,
    Item: {
      etagType: etagType,
      etag: key
    }
  }

  try {
    await dynamoDb.put(params).promise()
    return key
  } catch(ex) {
    throw ex
  }

}

module.exports = {
  getETag,
  createETag
}
