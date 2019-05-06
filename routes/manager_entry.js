const ManagerEntryData = require('../data_schema/manager_entry_data')
const express = require('express')
const Status = require('http-status-codes')
const router = express.Router()

// TODO: Input data validation.

/**
 * POST manager/entries/
 * Create new entry.
 * @req.body:{_id:Number, content: String, location: String}
 * @return Data of created entry.
 */
router.post('/', function (req, res) {
  let data = new ManagerEntryData()

  const {content, location, completed} = req.body

  if (!content && content === '') {
    return res
      .status(Status.BAD_REQUEST)
      .json({success: false, message: 'Invalid inputs: no content key or content is empty.'})
  }

  if (!location && location === '') {
    return res
      .status(Status.BAD_REQUEST)
      .json({success: false, message: 'Invalid inputs: no location key or location is empty.'})
  }

  data.content = content
  data.location = location
  data.completed = completed
  data.save()
    .then(() => {res.json({success: true, data: data})})
    .catch(err => {
      res.status(Status.INTERNAL_SERVER_ERROR).json({success: false, error: err})
    })
})

/**
 * PUT manager/entries/content/
 * Update content.
 * @req.body:{_id:Number, content: String}
 * @return: updated data
 */
router.put('/content/', function (req, res) {
  const {_id, content} = req.body

  if (!content && content === '') {
    return res
      .status(Status.BAD_REQUEST)
      .json({success: false, message: 'Invalid inputs: no content key or content is empty.'})
  }

  const query = ManagerEntryData.where({_id: _id})
  findOneAndUpdateHelper(query, {content: content}, res);
})

/**
 * PUT manager/entries/location/
 * Update location.
 * @req.body:{_id:Number, location: String}
 * @return: updated data
 */
router.put('/location/', function (req, res) {
  const {_id, location} = req.body

  if (!location && location === '') {
    return res
      .status(Status.BAD_REQUEST)
      .json({success: false, message: 'Invalid inputs: no location key or location is empty.'})
  }

  const query = ManagerEntryData.where({_id: _id})
  findOneAndUpdateHelper(query, {location: location}, res);
})

/**
 * PUT manager/entries/completed/
 * Update completed status.
 * @req.body:{_id:Number, completed: Boolean}
 * @return: updated data
 */
router.put('/completed/', function (req, res) {
  const {_id, completed} = req.body

  if (completed === null) {
    return res
      .status(Status.BAD_REQUEST)
      .json({success: false, message: 'Invalid inputs: no completed key.'})
  }

  const query = ManagerEntryData.where({_id: _id})
  findOneAndUpdateHelper(query, {completed: completed}, res);
})

/**
 * GET manager/entries/
 * Get all entries.
 * @return: Data array.
 */
router.get('/', (req, res) => {
  ManagerEntryData.find()
    .then(data => {
      if (data === null) {
        res
          .status(Status.NOT_FOUND)
          .json({success: false, message: 'Can\'t find any entry.'})
      } else {
        res.json({success: true, data: data})
      }
    })
    .catch(err => {
        return res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({success: false, message: err})
      }
    )
})

/**
 * GET manager/entries/id/[id]
 * Get entry by id.
 * @req.body:{_id: Number}
 * @return: Data of entry.
 */
router.get('/id/:id', (req, res) => {
  const query = ManagerEntryData.where({_id: req.params.id})

  ManagerEntryData.findOne(query)
    .then(data => {
      if (data === null) {
        res
          .status(Status.NOT_FOUND)
          .json({success: false, message: 'Can\'t find entry by id: ' + req.params.id})
      } else {
        res.json({success: true, data: data})
      }
    })
    .catch(err => {
      res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({success: false, message: err})
    })
})

/**
 * GET manager/entries/location/
 * Get entries by location key.
 * @req.body:{_id: Number, location: String}
 * @return: Data array.
 */
router.get('/location/:location', (req, res) => {
  const query = ManagerEntryData.where({location: req.params.location})

  ManagerEntryData.find(query)
    .then(data => {
      if (data === null) {
        res
          .status(Status.NOT_FOUND)
          .json({success: false, message: 'Can\'t find entry by location: ' + req.params.location})
      } else {
        res.json({success: true, data: data})
      }
    })
    .catch(err => {
      res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({success: false, message: err})
    })
})

/**
 * DELETE manager/entries/id/[id]
 * Get entry by id and remove.
 * @req.body {_id: Number}
 * @return: Removed data.
 */
router.delete('/id/:id', (req, res) => {
  const _id = req.params.id
  ManagerEntryData.findByIdAndRemove(_id)
    .then((data) => {
      res.json({success: true, data: data})
    })
    .catch((err) => {
      res.status(Status.INTERNAL_SERVER_ERROR).json({success: false, message: err})
    })
})

/**
 * Utility. Find one entry by given query and updated it by given update key/value pair.
 * Ensure updated key is has been set in data Schema.
 * @param query: Conditions.
 * @param updated: {key, value}
 * @param res: respond from HTTP request.
 */
function findOneAndUpdateHelper (query, updated, res) {
  ManagerEntryData.findOneAndUpdate(query, updated, {new: true})
    .then(data => {
      if (data === null) {
        res
          .status(Status.NOT_FOUND)
          .json({success: false, message: 'Can\'t find entry by id: ' + _id})
      } else res.json({success: true, data: data})
    })
    .catch((err) => {
      res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({success: false, message: err})
    })
}

module.exports = router
