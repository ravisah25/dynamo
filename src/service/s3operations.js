'use strict'

const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')
const mime = require('mime-types')

const FIVE_MINUTES = 5 * 60
const CONTENT_BUCKET = process.env.CONTENT_BUCKET
const BULKUPLOAD_BUCKET = process.env.BULKUPLOAD_TEMP_BUCKET
const s3 = new AWS.S3({
  'accessKeyId': process.env.aws_access_key_id,
  'secretAccessKey': process.env.aws_secret_access_key,
  'region': process.env.aws_region || 'ap-south-1'
})

const getSignedUrl = (extension) => {
  let responseParams = {
    'contentStorageKey': uuidv1() + '.' + extension,
    'contentStorageBucketName': CONTENT_BUCKET,
    'contentType': mime.contentType(extension)
  }

  const params = {
    Bucket: responseParams.contentStorageBucketName,
    Key: responseParams.contentStorageKey,
    Expires: FIVE_MINUTES,
    ContentType: responseParams.contentType
  }

  try {
    const presignedURL = s3.getSignedUrl('putObject', params)
    return { ...responseParams, presignedURL }
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

const verifyFileExists = async (filename) => {
  const params = {
    Bucket: BULKUPLOAD_BUCKET,
    Key: filename
  }

  try {
    await s3.headObject(params).promise()
    return {
      fileExists: true,
      filename
    }
  } catch(ex) {
    if (ex.code === 'NotFound') {
      return {
        fileExists: false,
        filename
      }
    }
    console.error(ex)
    throw ex
  }
}

const verifyFileListExists = async (filenameList) => {
  const existsPromises = filenameList.map(verifyFileExists)
  try {
    return await Promise.all(existsPromises)
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

const copyFile = async (filename) => {
  if (!filename) {
    throw new Error("Invalid filename to copy in s3")
  }

  const newFilename = `${uuidv1()}-${filename}`
  const params = {
    Bucket: CONTENT_BUCKET,
    CopySource: `/${BULKUPLOAD_BUCKET}/${filename}`,
    Key: newFilename
  }

  try {
    await s3.copyObject(params).promise()
    return newFilename
  } catch (ex) {
    console.error("error in s3 copy", ex)
    throw ex
  }
}

const copyFileList = async (fileList) => {
  const fileListPromises = fileList.map(copyFile)
  try {
    return await Promise.all(fileListPromises)
  } catch(ex) {
    throw ex
  }
}

module.exports = {
  getSignedUrl,
  copyFileList,
  verifyFileListExists
}
