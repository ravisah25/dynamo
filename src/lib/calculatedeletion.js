'use strict'

const { deleteCurriculumRecord, getSubjectsWithKeys } = require('../models/curriculum')
const { createETag } = require('../models/etags')
const { getCurriculumKey, getContentKey } = require('../lib/createKeys')
const { deleteContentRecord, getKeysWithParentId } = require('../models/content')

const getOrgKeys = (records) => {
  const keysList = []
  if (records && Array.isArray(records) && records.length) {
    records.forEach(board => {
      if (!board) {
        return
      }
      if (board.hasOwnProperty('classes') &&
          Array.isArray(board.classes) && board.classes.length) {
        board.classes.forEach(cls => {
          if (!cls) {
            return
          }
          let key
          if (cls.hasOwnProperty('classId') && cls.classId) {
            key = {
              boardId: board.boardId,
              classId: cls.classId
            }
          }
          if (cls.hasOwnProperty('groups') &&
              Array.isArray(cls.groups) && cls.groups.length) {
            cls.groups.forEach(group => {
              if (!group) {
                return
              }
              if (group.hasOwnProperty('groupId') && group.groupId) {
                keysList.push({...key, groupId: group.groupId})
              }
            })
          } else {
            keysList.push(key)
          }
        })
      }
    })
  }
  return keysList
}

const getSubjectKeys = (subject) => {
  const keysList = []
  let subjectKeys = {
    subjectId: subject.subjectId
  }
  if (subject.hasOwnProperty('chapters')
    && Array.isArray(subject.chapters)
    && subject.chapters.length) {
    subject.chapters.forEach(chapter => {
      if (!chapter || !Object.keys(chapter).length) {
        return
      }

      subjectKeys = {
        chapterId: chapter.chapterId,
        ...subjectKeys
      }
      if (chapter.hasOwnProperty('topics')
        && Array.isArray(chapter.topics)
        && chapter.topics.length) {
        chapter.topics.forEach(topic => {
          if (!topic || !Object.keys(topic).length) {
            return
          }

          keysList.push({
            topicId: topic.topicId,
            ...subjectKeys
          })
        })
      }
    }) 
  }
  return keysList
}

const getContentKeyToDelete = (records) => {
  const keyList = []
  if (records && Array.isArray(records) && records.length) {
    records.forEach(record => {
      if (!record || !Object.keys(record).length) {
        return
      }
      let key = {
        boardId: record.Item.boardId,
        classId: record.Item.classId
      }

      if (record.Item.hasOwnProperty('groupId')) {
        key = {
          groupId: record.Item.groupId,
          ...key
        }
      }

      if (record.Item.hasOwnProperty('subjects')
        && Array.isArray(record.Item.subjects)
        && record.Item.subjects.length) {
        record.Item.subjects.forEach(subject => {
          if (!subject || !Object.keys(subject).length) {
            return
          }
          const subjectKeys = getSubjectKeys(subject)
          if (subjectKeys && Array.isArray(subjectKeys) && subjectKeys.length) {
            subjectKeys.forEach(subjectKey => {
              if (!subjectKey) {
                return
              }
              keyList.push({
                ...key,
                ...subjectKey
              })
            })
          }
        })
      }
    })
  }
  return keyList
}

const calculateDeletedOrgKeys = (currentRecords, newRecords) => {
  const currentKeys = getOrgKeys(currentRecords)
  const newKeys = getOrgKeys(newRecords)
  let currentShas = currentKeys.map(key => {
    let [err, sha] = getCurriculumKey(key)
    return sha
  })
  let newshas = newKeys.map(key => {
    let [err, sha] = getCurriculumKey(key)
    return sha
  })

  return currentShas.filter(current => (
    !newshas.includes(current)
  ))
}

const deleteOrgChildren = async (oldBoards, newBoards) => {
  try {
    const subjectKeysToDelete = calculateDeletedOrgKeys(oldBoards, newBoards)
    const getSubjectPromises = subjectKeysToDelete.map(getSubjectsWithKeys)
    const subjectsToDelete = await Promise.all(getSubjectPromises)
    let contentKeysToDelete = getContentKeyToDelete(subjectsToDelete)
    contentKeysToDelete = contentKeysToDelete.map(key => {
      let [err, sha] = getContentKey(key)
      return sha
    })
    const deleteContentPromises = contentKeysToDelete.map(deleteContentRecord)
    const deleteSubjectPromises = subjectKeysToDelete.map(deleteCurriculumRecord)
    await Promise.all(deleteSubjectPromises)
    await createETag('subject')
    await Promise.all(deleteContentPromises)
    await createETag('content')
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

const getIdFromObjectName = (objectName) => {
  switch (objectName) {
    case 'subjects':
      return 'subjectId'
    case 'chapters':
      return 'chapterId'
    case 'topics':
      return 'topicId'
    default:
      return 'subjectId'
  }
}

const getIdList = (objectList, idName) => {
  if (objectList && Array.isArray(objectList) && objectList.length) {
    return objectList.map(object => object[idName])
  }
}

const getIdsToDelete = (oldObjectList, newObjectList, idName) => {
  const oldIdList = getIdList(oldObjectList, idName) || []
  const newIdList = getIdList(newObjectList, idName) || []
  return oldIdList.filter(oldId => (
    !newIdList.includes(oldId)
  ))
}

const calculateDeletedCurrKeys = (subjects, data, objectName) => {
  let subjectObject
  switch(objectName) {
    case 'subjects':
      return getIdsToDelete(subjects, data[objectName],
        getIdFromObjectName(objectName))
    case 'chapters':
      subjectObject = subjects.find(subject => (
        subject.subjectId === data.subjectId
      ))
      return getIdsToDelete(subjectObject.chapters, data[objectName],
        getIdFromObjectName(objectName))
    case 'topics':
      subjectObject = subjects.find(subject => (
        subject.subjectId === data.subjectId
      ))
      const chapterObject = subjectObject.chapters.find(chapter => (
        chapter.chapterId === data.chapterId
      ))
      return getIdsToDelete(chapterObject.topics, data[objectName],
        getIdFromObjectName(objectName))
    default:
      return null
  }

}

const deleteCurriculumChildren = async (oldSubjects, data, objectName) => {

  try {
    const deletedCurrKeys = calculateDeletedCurrKeys(oldSubjects, data, objectName)
    const getContentPromises = deletedCurrKeys.map(key => (
      getKeysWithParentId(getIdFromObjectName(objectName), key)
    ))
    const contentList = await Promise.all(getContentPromises)
    const contentKeys = contentList[0]
    if (contentKeys && Array.isArray(contentKeys)
      && contentKeys.length) {
      const keyList = contentKeys.map(contentObj => (
        contentObj.contentKey
      ))
      const deleteContentPromises = keyList.map(deleteContentRecord)
      await Promise.all(deleteContentPromises)
      await createETag('content')
    }
  } catch(ex) {
    console.error(ex)
    throw ex
  }
}

module.exports = {
  deleteOrgChildren,
  deleteCurriculumChildren
}
