'use strict'

const AWS = require('aws-sdk')

module.exports = (
  new AWS.DynamoDB.DocumentClient({
    'accessKeyId': process.env.aws_access_key_id,
    'secretAccessKey': process.env.aws_secret_access_key,
    'region': process.env.aws_region || 'ap-south-1'
  })
)
