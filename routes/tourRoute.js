const { getAllTours, checkId } = require('../controller/tourController')

const router = require('express').Router()

router.param('id', checkId)

router
  .route('/')
  .get(getAllTours)

// router
// .route('/:id')
// .get(getT)

module.exports = router