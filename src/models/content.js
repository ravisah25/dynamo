'use strict'

const { preCreateContentKeys } = require('../lib/precreate')
const dynamoDb = require('./index')
const { recursiveScan } = require('../lib/recursiveScan')
const CONTENT_TABLE = process.env.CONTENT_TABLE

const getContent = async (contentKey) => {

  const params = {
    TableName: CONTENT_TABLE,
    Key: {
      contentKey: contentKey
    },
    ProjectionExpression: 'contentDetails'
  }

  try {
    return await dynamoDb.get(params).promise()
  } catch(ex) {
    throw ex
  }

}

const addContent = async (contentKey, data) => {

  const preItem = preCreateContentKeys(data)

  const params = {
    TableName: CONTENT_TABLE,
    Item: {
      contentKey,
      contentDetails: data.contents,
      ...preItem
    }
  }

  try {
    await dynamoDb.put(params).promise()
  } catch (ex) {
    throw ex
  }
}

const updateContent = async (contentKey, contentList) => {

  const params = {
    TableName: CONTENT_TABLE,
    Key: { contentKey },
    UpdateExpression: 'set #cotentDetails = list_append(if_not_exists(#cotentDetails, :empty_list), :contentList)',
    ExpressionAttributeNames: {
      '#cotentDetails': 'contentDetails'
    },
    ExpressionAttributeValues: {
      ':empty_list': [],
      ':contentList': contentList
    }
  }

  try {
    await dynamoDb.update(params).promise()
  } catch (ex) {
    console.error("error updating content table", ex)
    throw ex
  }

}

const deleteContentRecord = async (contentKey) => {
  const params = {
    TableName: CONTENT_TABLE,
    Key: { contentKey }
  }

  try {
    await dynamoDb.delete(params).promise()
  } catch(ex) {
    throw ex
  }
}

const getKeysWithParentId = async (idName, idValue) => {
  const params = {
    TableName: CONTENT_TABLE,
    FilterExpression: "#idName = :idValue",
    ExpressionAttributeNames:{
        "#idName": idName
    },
    ExpressionAttributeValues: {
        ":idValue": idValue
    },
    ProjectionExpression: 'contentKey',
    Limit: 50
  }

  try {
    return await recursiveScan(dynamoDb, params)
  } catch (ex) {
    throw ex
  }
}

module.exports = {
  getContent,
  addContent,
  deleteContentRecord,
  updateContent,
  getKeysWithParentId
}
