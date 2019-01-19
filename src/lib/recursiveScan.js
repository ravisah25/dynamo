'use strict'

const recursiveScan = (dynamoDb, params) => {
  let items = []
  return dynamoDb.scan(params).promise()
    .then(data => {
      let newItems = data.Items.map(item => item)
      items = [...items, ...newItems]
      if (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey
        return recursiveScan(dynamoDb, params)
      }
      return Promise.resolve(items)
    })
    .catch(err => {
      console.error("Error in recursive scan", err)
    })
}

module.exports = {
  recursiveScan
}
