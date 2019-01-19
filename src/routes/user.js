'use strict'

const packageRouter = require('express').Router()
const getResponse = require('../lib/responsecodes')
const { getLogin,
        createUserRecord,UserProfile,contentFunc, getUserData } = require('../models/user')


const getUsers = async (req, res) => {

  try {
    const records = await getLogin(req)
    res.status(200).json(records)
  } catch (ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't find User"))
  }

}

const getUsersData = async (req, res) => {

  try {
    const records = await getUserData(req)
    res.status(200).json(records)
  } catch (ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't find Data"))
  }

}


const addUser = async (req, res) => {


  try {
    await createUserRecord(req)
    res.status(201).json(getResponse(true, 'Package created successfully'))
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't create package"))
  }
}


const addProfile = async  (req, res) => {

  try {
    await UserProfile(req)
    res.status(201).json(getResponse(true, 'Add profile successfully'))
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't add profile"))
  }

}

const contentData = async  (req, res) => {
  try {
    const responseData =  await contentFunc(req)
    res.status(201).json(responseData)
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't add cntent package"))
  }

}




packageRouter.get('/', getUsers)
packageRouter.get('/data', getUsersData)
packageRouter.post('/', addUser)
packageRouter.post('/profile', addProfile)
packageRouter.post('/content', contentData)

module.exports = packageRouter
