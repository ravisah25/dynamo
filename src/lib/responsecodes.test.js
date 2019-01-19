'use strict'

const getResponseCode = require('./responsecodes')

test('Generates a valid response for success', () => {
  const result = {
    'success': true,
    'successResponse': [{
        message: 'Successfully updated organization record'
    }]
  }
  expect(getResponseCode(true, 'UPDATED_ORG_RECORD')).toEqual(result)
})

test('Generate response for REQUEST_BODY_EMPTY', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: 'Empty request body for the organization'
    }]
  }
  expect(getResponseCode(false, 'REQUEST_BODY_EMPTY')).toEqual(result)
})

test('Generate response for ETAG_EMPTY', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: "ETag in headers 'If-Match' is empty"
    }]
  }
  expect(getResponseCode(false, 'ETAG_EMPTY')).toEqual(result)
})

test('Generate response for ETAG_MISMATCH', () => {
  const args = ['24', '42']
  const result = {
    'success': false,
    'errorResponse': [{
        message: `Request ETag ${args[0]} did not match with existing ETag ${args[1]}`
    }]
  }
  expect(getResponseCode(false, 'ETAG_MISMATCH', ...args)).toEqual(result)
})

test('Generate response for ERROR_RETRIEVING_ETAG', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: `Failed to retrieve stored ETag`
    }]
  }
  expect(getResponseCode(false, 'ERROR_RETRIEVING_ETAG')).toEqual(result)
})

test('Generate response for ERROR_UPDATING_ORG', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: `Could not update Organization record`
    }]
  }
  expect(getResponseCode(false, 'ERROR_UPDATING_ORG')).toEqual(result)
})

test('Generate response for ERROR_FETCHING_ORG', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: `Could not fetch organization details`
    }]
  }
  expect(getResponseCode(false, 'ERROR_FETCHING_ORG')).toEqual(result)
})

test('Generate response for default error case', () => {
  const result = {
    'success': false,
    'errorResponse': [{
        message: `Invalid request parameters`
    }]
  }
  expect(getResponseCode(false, 'Invalid request parameters')).toEqual(result)
})
