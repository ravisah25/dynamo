const getResponse = require('../lib/responsecodes')
const { getFeatures } = require('../models/organization')

const features = async (req, res) => {
  try {
    const record = await getFeatures()
    res.status(200).json(record)
  } catch (ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, 'Error getting features'))
  }
}

module.exports = {
  features
}
