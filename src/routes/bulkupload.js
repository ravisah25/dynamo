'use strict'

const getResponse = require('../lib/responsecodes')
const { verifyFileListExists, copyFileList } = require('../service/s3operations')
const { getContentKey } = require('../lib/createKeys')
const { updateContent } = require('../models/content')
const { getContentMetadata } = require('../lib/generateMetadata')
const { createETag } = require('../models/etags')

const copyAndUpdateFiles = async (contentKey, filelist) => {
  try {
    const newFilenameList = await copyFileList(filelist)
    const files = filelist.map((filename, index) => ({
      originalFilename: filename,
      newFilename: newFilenameList[index]
    }))
    const metadatalist = files.map(getContentMetadata)
    await updateContent(contentKey, metadatalist)
    await createETag('content')
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

const bulkUpload = async (req, res) => {

  const [error, contentKey] = getContentKey(req.body)

  if (error) {
    console.error(error)
    return res.status(400).json(getResponse(false, ''))
  }

  const { filelist } = req.body
  if (!Array.isArray(filelist) || !filelist.length) {
    return res.status(400).json(getResponse(false, ''))
  }

  let filenameList = filelist.map(file => file.filename)

  const getNotFoundFiles = (results) => {
    let notFoundFiles = results.filter(result => (
      !result.fileExists
    ))
    notFoundFiles = notFoundFiles.map(file => file.filename)

    if (Array.isArray(notFoundFiles) && notFoundFiles.length) {
      notFoundFiles = filelist.filter(file => (
        notFoundFiles.includes(file.filename)
      ))
    }
    return notFoundFiles
  }

  try {
    const results = await verifyFileListExists(filenameList)
    const notFound = getNotFoundFiles(results)
    if (notFound.length) {
      throw { missingFiles: notFound }
    }
    res.status(200).json(getResponse(true, 'Record created successfully'))
    try {
      await copyAndUpdateFiles(contentKey, filenameList)
    } catch (ex) {
      console.error("error copying files", ex)
    }
  } catch(ex) {
    if (ex.missingFiles) {
      return res.status(404).json({
        success: false,
        missingFiles: ex.missingFiles
      })
    }
    console.error(ex)
    res.status(500).json(getResponse(false, 'Error connecting to S3'))
  }
}

module.exports = {
  bulkUpload
}
