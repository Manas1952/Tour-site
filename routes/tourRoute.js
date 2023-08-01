const { getAllTours, getTour, updateTour, deleteTour, createTour, aliasTopTours, getTourStats, getMonthlyPlan } = require('../controller/tourController')

const router = require('express').Router()

router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

router.route('/tour-stats')
  .get(getTourStats)
  
router.route('/')
  .get(getAllTours)
  .post(createTour)

router.route('/:id')
  .get(getTour)
  .put(updateTour)
  .delete(deleteTour)


router.route('/monthly-plan/:year')
  .get(getMonthlyPlan)

module.exports = router