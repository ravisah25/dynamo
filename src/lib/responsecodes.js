'use strict'

const getResponse = (message, args) => {
  switch(message) {
    case 'UPDATED_ORG_RECORD':
      return {
        message: 'Successfully updated organization record'
      }
    case 'REQUEST_BODY_EMPTY':
      return {
        message: 'Empty request body for the organization'
      }
    case 'ETAG_EMPTY':
      return {
        message: `ETag in headers 'If-Match' is empty`
      }
    case 'ETAG_MISMATCH':
      return {
        message: `Request ETag ${args[0]} did not match with existing ETag ${args[1]}`
      }
    case 'ERROR_RETRIEVING_ETAG':
      return {
        message: 'Failed to retrieve stored ETag'
      }
    case 'ERROR_UPDATING_ORG':
      return {
        message: 'Could not update Organization record'
      }
    case 'ERROR_FETCHING_ORG':
      return {
        message: 'Could not fetch organization details'
      }
    default:
      return { message }
  }
}

module.exports = (success, message, ...args) => {
  success = success || false
  const responseObj = { success }
  responseObj[(success ? 'successResponse' : 'errorResponse')] = [
      getResponse(message, args)]
  return responseObj
}
