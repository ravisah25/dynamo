'use strict'

const { getContentMetadata } = require('./generateMetadata')

test('Get content metadata: PPT', () => {
  const file = {
    originalFilename: 'hello.PPT',
    newFilename: 'hello.PPT'
  }
  const result = getContentMetadata(file)
  expect(result).toEqual({
    contentId: expect.any(String),
    contentName: file.originalFilename,
    contentResourceType: 'PPT',
    contentStorageKey: file.newFilename,
    contentStorageBucketName: process.env.CONTENT_BUCKET,
    contentFileName: file.originalFilename,
    contentFileType: 'PPT'
  })
})

test('Get content metadata: PDF', () => {
  const file = {
    originalFilename: 'hello.PDF',
    newFilename: 'hello.PDF'
  }
  const result = getContentMetadata(file)
  expect(result).toEqual({
    contentId: expect.any(String),
    contentName: file.originalFilename,
    contentResourceType: 'PDF',
    contentStorageKey: file.newFilename,
    contentStorageBucketName: process.env.CONTENT_BUCKET,
    contentFileName: file.originalFilename,
    contentFileType: 'PDF'
  })
})

test('Get content metadata: Video', () => {
  const file = {
    originalFilename: 'hello.avi',
    newFilename: 'hello.avi'
  }
  const result = getContentMetadata(file)
  expect(result).toEqual({
    contentId: expect.any(String),
    contentName: file.originalFilename,
    contentResourceType: 'Video',
    contentStorageKey: file.newFilename,
    contentStorageBucketName: process.env.CONTENT_BUCKET,
    contentFileName: file.originalFilename,
    contentFileType: 'avi'
  })
})
