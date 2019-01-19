'use strict'

const getResponse = require('../lib/responsecodes')
const { getSignedUrl } = require('../service/s3operations')

module.exports = (req, res) => {
  const { extension } = req.query
  if (!extension) {
    console.error('Invalid parameter extension')
    return res.status(400).json(getResponse(false, 'extension cannot be empty'))
  }
  
  try {
    const response = getSignedUrl(extension)
    res.status(200).json(response)
  } catch(ex) {
    console.error(ex)
    res.status(500).json(getResponse(false, 'Error getting presignedurl')) 
  }
}
