'use strict'

const preCreateCurriculumKeys = (data) => {

  const preData = {}
  for (let key in data) {
    switch(key) {
      case 'boardId':
        preData[key] = data[key]
        continue
      case 'classId':
        preData[key] = data[key]
        continue
      case 'groupId':
        preData[key] = data[key]
        continue
      default:
        continue
    }
  }

  return preData
}

const preCreateContentKeys = (data) => {

  const preData = preCreateCurriculumKeys(data)
  for (let key in data) {
    switch(key) {
      case 'subjectId':
        preData[key] = data[key]
        continue
      case 'chapterId':
        preData[key] = data[key]
        continue
      case 'topicId':
        preData[key] = data[key]
        continue
      default:
        continue
    }
  }

  return preData
}

module.exports = {
  preCreateCurriculumKeys,
  preCreateContentKeys
}
