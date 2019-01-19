'use strict'

const getResponse = require('../lib/responsecodes')
const { getSubjects, addChapter } = require('../models/curriculum')
const { getETag, createETag } = require('../models/etags')
const { getCurriculumKey } = require('../lib/createKeys')
const { deleteCurriculumChildren } = require('../lib/calculatedeletion')

module.exports = async (req, res) => {

  const [error, subjectkey] = getCurriculumKey(req.body)
  const { subjectId, chapters } = req.body
  const requestETag = req.header('If-Match')

  if (error) {
    console.error(error)
    return res.status(400).json(
      getResponse('INVALID_CURRICULUM_PARAMS'))
  }

  if (!subjectId || !chapters) {
    console.error('Invalid subjectid or chapters')
    return res.status(400).json(
      getResponse('INVALID_CURRICULUM_PARAMS'))
  }

  try {
    const chapterEtag = await getETag('subject')
    if (chapterEtag && chapterEtag !== requestETag) {
      console.error('Chapter ETags did not match')
      return res.status(412)
        .json(getResponse(false, 'ETAG_MISMATCH', requestETag, chapterEtag))
    }
  } catch(ex) {
    console.error(ex)
    return res.status(404)
      .json(getResponse(false, 'ERROR_RETRIEVING_ETAG'))
  }

  try {
    const oldRecord = await getSubjects(subjectkey)
    const record = await addChapter(subjectkey, subjectId, chapters)
    const etag = await createETag('subject')
    res.header('ETag', etag)
    res.status(200).json(record)
    try {
      (oldRecord && Object.keys(oldRecord).length)
      && await deleteCurriculumChildren(oldRecord.Item.subjects, req.body, 'chapters')
    } catch (ex) {
      console.error(ex)
    }
  } catch(ex) {
    console.error('Error updating chapters ', ex)
    res.status(404).json(getResponse(false, 'Error adding chapter'))
  }
}
