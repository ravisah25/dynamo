'use strict'

const packageRouter = require('express').Router()
const getResponse = require('../lib/responsecodes')
const { getPackageRecords, getPackageRecord,
        createPackageRecord, updatePackageRecord } = require('../models/package')


const getPackages = async (req, res) => {

  try {
    const records = await getPackageRecords()
    res.status(200).json(records)
  } catch (ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't find packages"))
  }

}

const getPackage = async (req, res) => {

  const { packageId } = req.params
  if (!packageId) {
    return res.status(400).json(getResponse(false, 'Invalid or empty packageId'))
  }

  try {
    const record = await getPackageRecord(packageId)
    res.status(200).json(record)
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't find package with given Id"))
  }

}

const addPackage = async (req, res) => {
  if (!Object.keys(req.body).length) {
    console.error('Request body cannot be empty')
    return res.status(400).json(getResponse(false, 'Invalid or empty package details'))
  }

  if (!req.body.packageId) {
    console.error('packageId is empty')
    return res.status(400).json(getResponse(false, 'Invalid or empty packageId'))
  }

  try {
    await createPackageRecord(req.body)
    res.status(201).json(getResponse(true, 'Package created successfully'))
  } catch(ex) {
    console.error(ex)
    res.status(404).json(getResponse(false, "Couldn't create package"))
  }
}

const updatePackage = async (req, res) => {
  const { packageId } = req.params
  if (!packageId) {
    return res.status(400).json(getResponse(false, 'Invalid or empty packageId'))
  }

  if (!Object.keys(req.body).length) {
    console.error('Request body cannot be empty')
    return res.status(400).json(getResponse(false, 'Invalid or empty package details'))
  }

  try {
    await updatePackageRecord(packageId, req.body)
    res.status(201).json(getResponse(true, 'Package updated successfully'))
  } catch(ex) {
    console.error(error)
    res.status(404).json(getResponse(false, "Couldn't update package"))
  }
  
}

packageRouter.get('/', getPackages)
packageRouter.post('/', addPackage)
packageRouter.get('/:packageId', getPackage)
packageRouter.put('/:packageId', updatePackage)

module.exports = packageRouter
