const orgRouter = require('express').Router()
const getResponse = require('../lib/responsecodes')
const { getBoards, putBoards } = require('../models/organization')
const { deleteOrgChildren } = require('../lib/calculatedeletion')
const { getETag, createETag } = require('../models/etags')

orgRouter.put('/', async (req, res) => {

  const requestETag = req.header('If-Match')
  if (!requestETag) {
    console.error('Organization Etag is empty')
    return res.status(400)
      .json(getResponse(false, 'ETAG_EMPTY'))
  }

  const { boards } = req.body
  if (!boards) {
    console.error('Request body is empty')
    return res.status(400)
      .json(getResponse(false, 'REQUEST_BODY_EMPTY'))
  }

  try {
    const orgETag = await getETag('organization')
    if (orgETag && orgETag !== requestETag) {
      console.error('Organizations ETags did not match')
      return res.status(412)
        .json(getResponse(false, 'ETAG_MISMATCH', requestETag, orgETag))
    }
  } catch(ex) {
    console.error(ex)
    return res.status(500)
      .json(getResponse(false, 'ERROR_RETRIEVING_ETAG'))
  }

  try {
    const oldBoardsRecord = await getBoards()
    const record = await putBoards(boards)
    const newETag = await createETag('organization')
    res.header('ETag', newETag)
    res.status(200).json(record)
    try {
      (oldBoardsRecord && Object.keys(oldBoardsRecord).length)
      && await deleteOrgChildren(oldBoardsRecord.Item.boards, boards)
    } catch(ex) {
      console.error(ex)
    }
  } catch(ex) {
    console.error('Error updating organization ', ex)
    res.status(500).json(getResponse(false, 'ERROR_UPDATING_ORG'))
  }

})

orgRouter.get('/', async (req, res) => {

  try {
    const record = await getBoards()
    const etag = await getETag('organization')
    res.header('ETag', etag)
    res.status(200).json(record)
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'ERROR_FETCHING_ORG'))
  }

})

module.exports = orgRouter
