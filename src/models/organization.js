'use strict'

const dynamoDb = require('./index')
const ORGANIZATIONS_TABLE = process.env.ORGANIZATIONS_TABLE
const ORG_ID = process.env.ORG_ID

const getOrganizationEntity = async (projection, organizationId) => {

  const params = {
    TableName: ORGANIZATIONS_TABLE,
    Key: {
      organizationId: organizationId
    },
    ProjectionExpression : projection
  }

  try {
    return await dynamoDb.get(params).promise()
  } catch(ex) {
    throw ex
  }

}

const getFeatures = async (organizationId = ORG_ID) => {
  return getOrganizationEntity('features', organizationId)
}

const getBoards = async (organizationId = ORG_ID) => {
  return getOrganizationEntity('boards', organizationId)
}

const putBoards = async (boards, organizationId = ORG_ID) => {

  const params = {
    TableName: ORGANIZATIONS_TABLE,
    Key: {
      organizationId: organizationId
    },
    UpdateExpression: 'set #boards = :boards',
    ExpressionAttributeNames: {
      '#boards': 'boards'
    },
    ExpressionAttributeValues: {
      ':boards': boards
    },
    ReturnValues:"UPDATED_NEW"
  };

  try {
    return await dynamoDb.update(params).promise()
  } catch (ex) {
    throw ex
  }

}

module.exports = {
  getBoards,
  putBoards,
  getFeatures
}
