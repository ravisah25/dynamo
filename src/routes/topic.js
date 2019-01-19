'use strict'

const getResponse = require('../lib/responsecodes')
const { getSubjects, addTopic } = require('../models/curriculum')
const { getETag, createETag } = require('../models/etags')
const { getCurriculumKey } = require('../lib/createKeys')
const { deleteCurriculumChildren } = require('../lib/calculatedeletion')

module.exports = async (req, res) => {

  const [error, subjectkey] = getCurriculumKey(req.body)
  const { subjectId, chapterId, topics } = req.body
  const requestETag = req.header('If-Match')

  if (error) {
    console.error(error)
    return res.status(400).json(
      getResponse(false, 'INVALID_CURRICULUM_PARAMS'))
  }

  if (!subjectId || !chapterId || !topics) {
    console.error('Invalid subjectid or topics')
    return res.status(400).json(
      getResponse(false, 'INVALID_CURRICULUM_PARAMS'))
  }

  try {
    const subjectEtag = await getETag('subject')
    if (subjectEtag && subjectEtag !== requestETag) {
      console.error('subject ETags did not match')
      return res.status(412)
        .json(getResponse(false, 'ETAG_MISMATCH', requestETag, subjectEtag))
    }
  } catch(ex) {
    console.error(ex)
    return res.status(404)
      .json(getResponse(false, 'ERROR_RETRIEVING_ETAG'))
  }

  try {
    const oldRecord = await getSubjects(subjectkey)
    const record = await addTopic(subjectkey, subjectId, chapterId, topics)
    const etag = await createETag('subject')
    res.header('ETag', etag)
    res.status(200).json(record)
    try {
      (oldRecord && Object.keys(oldRecord).length)
      && await deleteCurriculumChildren(oldRecord.Item.subjects, req.body, 'topics')
    } catch (ex) {
      console.error(ex)
    }
  } catch(ex) {
    console.error('Error updating topics ', ex)
    res.status(404).json(
      getResponse(false, (ex && ex.message ? ex.message : 'Error updating topics'))
    )
  }
}
