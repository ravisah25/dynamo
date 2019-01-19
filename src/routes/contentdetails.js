'use strict'

const contentRouter = require('express').Router()
const getResponse = require('../lib/responsecodes')
const { getContentKey } = require('../lib/createKeys')
const { getContent, addContent } = require('../models/content')
const { getETag, createETag } = require('../models/etags')

const getContentDetails = async (req, res) => {

  const [error, contentKey] = getContentKey(res.locals.params)
  if (error) {
    console.error(error)
    return res.status(400).json(getResponse(false, error))
  }

  try {
    const record = await getContent(contentKey)
    const etag = await getETag('content')
    res.header('ETag', etag)
    res.status(200).json(record)
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'Could not find a related key'))
  }

}

const addContentDetails = async (req, res) => {

  const [error, contentKey] = getContentKey(req.body)
  if (error) {
    console.error(error)
    return res.status(400).json(getResponse(false, error))
  }

  if (!req.body.contents) {
    console.error("contentDetails object is empty")
    return res.status(400).json(getResponse(false, 'Content details is empty'))
  }

  try {
    await addContent(contentKey, req.body)
    const etag = await createETag('content')
    res.header('ETag', etag)
    res.status(201).json(getResponse(true, 'Content record created successfully'))
  } catch(ex) {
    console.error('Error updating contents ', ex)
    res.status(500).json(getResponse(false, 'Could not create a content record'))
  }

}

const updateContentDetails = async (req, res) => {
  const [error, contentKey] = getContentKey(req.body)
  const requestETag = req.header('If-Match')

  if (error) {
    console.error(error)
    return res.status(400).json(getResponse(false, error))
  }

  if (!req.body.contents) {
    console.error("contentDetails object is empty")
    return res.status(400).json(getResponse(false, 'Invalid of empty content details'))
  }

  try {
    const contentEtag = await getETag('content')
    if (contentEtag && contentEtag !== requestETag) {
      console.error('Content ETags did not match')
      return res.status(412)
        .json(getResponse(false, 'ETAG_MISMATCH', requestETag, contentEtag))
    }
  } catch(ex) {
    console.error(ex)
    return res.status(404)
      .json(getResponse(false, 'ERROR_RETRIEVING_ETAG'))
  }

  try {
    await addContent(contentKey, req.body)
    const etag = await createETag('content')
    res.header('ETag', etag)
    res.status(201).json(getResponse(true, 'Content record created'))
  } catch(ex) {
    console.error('Error updating contents ', ex)
    res.status(500).json(getResponse(false, "Couldn't update content details"))
  }
}

contentRouter.get('/', getContentDetails)
contentRouter.post('/', addContentDetails)
contentRouter.put('/', updateContentDetails)

module.exports = contentRouter
