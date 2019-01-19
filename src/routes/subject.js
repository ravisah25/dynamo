'use strict'

const subjectRouter = require('express').Router()
const getResponse = require('../lib/responsecodes')
const { getSubjects, addSubject } = require('../models/curriculum')
const { getETag, createETag } = require('../models/etags')
const { getCurriculumKey } = require('../lib/createKeys')
const { deleteCurriculumChildren } = require('../lib/calculatedeletion')

subjectRouter.get('/', async (req, res) => {

  const [error, subjectKey] = getCurriculumKey(res.locals.params)
  
  if (error) {
    console.error(error)
    return res.status(400).json(
      getResponse(false, 'INVALID_CURRICULUM_PARAMS'))
  }

  try {
    const record = await getSubjects(subjectKey)
    const etag = await getETag('subject')
    res.header('ETag', etag)
    res.status(200).json(record)
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'ERROR_FETCHING_CURRICULUM'))
  }
})

subjectRouter.post('/', async (req, res) => {

  const [error, subjectKey] = getCurriculumKey(req.body)
  if (error) {
    console.error(error)
    return res.status(400).json(
      getResponse(false, 'INVALID_CURRICULUM_PARAMS'))
  }

  try {
    const oldRecord = await getSubjects(subjectKey)
    await addSubject(subjectKey, req.body)
    await createETag('subject')
    res.status(201).json(getResponse(true, 'Created subjects'))
    try {
      (oldRecord && Object.keys(oldRecord).length)
      && await deleteCurriculumChildren(oldRecord.Item.subjects, req.body, 'subjects')
    } catch (ex) {
      console.error(ex)
    }
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'ERROR_INSERTING_SUBJECT'))
  }
})

subjectRouter.put('/', async (req, res) => {

  const requestETag = req.header('If-Match')
  if (!requestETag) {
    console.error('Organization Etag is empty')
    return res.status(400)
      .json(getResponse(false, 'ETAG_EMPTY'))
  }

  const [error, subjectKey] = getCurriculumKey(req.body)
  if (error) {
    console.error(error)
    return res.status(400).json(
      getResponse(false, 'INVALID_CURRICULUM_PARAMS'))
  }

  try {
    const subjectEtag = await getETag('subject')
    if (subjectEtag && subjectEtag !== requestETag) {
      console.error('Subject ETags did not match')
      return res.status(412)
        .json(getResponse(false, 'ETAG_MISMATCH', requestETag, subjectEtag))
    }
  } catch(ex) {
    console.error(ex)
    return res.status(404)
      .json(getResponse(false, 'ERROR_RETRIEVING_ETAG'))
  }

  try {
    const oldRecord = await getSubjects(subjectKey)
    await addSubject(subjectKey, req.body)
    await createETag('subject')
    res.status(201).json(getResponse(true, 'Created subjects'))
    try {
      (oldRecord && Object.keys(oldRecord).length)
      && await deleteCurriculumChildren(oldRecord.Item.subjects, req.body, 'subjects')
    } catch (ex) {
      console.error(ex)
    }
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'ERROR_INSERTING_SUBJECT'))
  }
})

module.exports = subjectRouter
