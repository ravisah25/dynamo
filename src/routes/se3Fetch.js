const getResponse = require('../lib/responsecodes')
const AWS = require('aws-sdk')
const CONTENT_BUCKET = process.env.CONTENT_BUCKET
const s3 = new AWS.S3({
    'accessKeyId': process.env.aws_access_key_id,
    'secretAccessKey': process.env.aws_secret_access_key,
    'region': process.env.aws_region || 'ap-south-1'
  })


const se3Fetch = async (req, res) => {
  var data = req.body;
  try {
        const url = s3.getSignedUrl('getObject', {
          Bucket: CONTENT_BUCKET,
          Key: data.preUrl,
          Expires:  60 * 50
      })
      console.log("url",url);
      res.status(200).json(url)

  } catch (ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'Error getting fetch'))
  }
}

module.exports = {
    se3Fetch
}
