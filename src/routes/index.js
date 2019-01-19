const baseRouter = require('express').Router()

const orgsRouter = require('./organization')
const subjectRouter = require('./subject')
const updateChapters = require('./chapter')
const updateTopics = require('./topic')
const getPresignedURL = require('./presignedurl')
const contentRouter = require('./contentdetails')
const packageRouter = require('./package')
const userRouter = require('./user')
const { bulkUpload } = require('./bulkupload')
const { features } = require('./features')
const { se3Fetch } = require('./se3Fetch')

const extractParams = (req, res, next) => {
  res.locals.params = req.params
  next()
}

baseRouter.use('/organization', orgsRouter)
baseRouter.use('/board/:boardId/class/:classId',
  extractParams, subjectRouter)
baseRouter.use('/board/:boardId/class/:classId/group/:groupId',
  extractParams, subjectRouter)
baseRouter.use('/subject', subjectRouter)

baseRouter.put('/chapter', updateChapters)
baseRouter.put('/topic', updateTopics)
baseRouter.get('/contenturl', getPresignedURL)
baseRouter.use('/content', contentRouter)
baseRouter.use('/board/:boardId/class/:classId/subject/:subjectId/chapter/:chapterId/topic/:topicId',
  extractParams, contentRouter)
baseRouter.use('/board/:boardId/class/:classId/group/:groupId/subject/:subjectId/chapter/:chapterId/topic/:topicId',
  extractParams, contentRouter)
baseRouter.use('/package', packageRouter)
baseRouter.use('/user', userRouter)
baseRouter.post('/bulkuploads3', bulkUpload)
baseRouter.get('/features', features)
baseRouter.post('/se3Fetch', se3Fetch)

module.exports = baseRouter
