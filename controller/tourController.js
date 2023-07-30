const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkId = (req, res, next, val) => {
  const id = req.params.id * 1
  if (id < 0 || id > tours.length - 1) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid ID'
    })
  }
  next()
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  })
}

exports.getTour = (req, res) => {
  const tour = tours.find(tour => tour.id === req.params.id)
  res.status(200).json({
    status: 'SUCCESS',
    data: { tour }
  })
}

exports.createTour