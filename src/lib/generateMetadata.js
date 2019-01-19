'use strict'

const uuidv1 = require('uuid/v1')

const CONTENT_BUCKET = process.env.CONTENT_BUCKET

const getContentMetadata = (file) => {
  let ext = file.originalFilename.match(/\.(\w+$)/)
  ext = ext.length > 1 ? ext[1] : 'NA'

  let resource
  switch (ext) {
    case 'PPT':
    case 'ppt':
      resource = 'PPT'
      break
    case 'PDF':
    case 'pdf':
      resource = 'PDF'
      break
    default:
      resource = 'Video'
      break;
  }

  return {
    contentId: uuidv1(),
    contentName: file.originalFilename,
    contentResourceType: resource,
    contentStorageKey: file.newFilename,
    contentStorageBucketName: CONTENT_BUCKET,
    contentFileName: file.originalFilename,
    contentFileType: ext
  }
}


module.exports = {
  getContentMetadata
}
