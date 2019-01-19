'use strict'

const {
  preCreateCurriculumKeys,
  preCreateContentKeys
} = require('./precreate')

let data = {
  'boardId': 'B001',
  'classId': 'C001',
  'groupId': 'G001'
}

test('Pre create curriculum keys', () => {
  const testdata = { ...data, ...{'hello': 'hellodummy'}}
  const result = preCreateCurriculumKeys(testdata)
  expect(result).toEqual(data)
})

test('Pre create content keys', () => {
  const testdata = {
    ...data,
    ...{
      'subjectId': 'S001',
      'chapterId': 'CH001',
      'topicId': 'T001'
    }
  }
  const result = preCreateContentKeys(testdata)
  expect(result).toEqual(testdata)
})
