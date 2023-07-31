const Tour = require('../model/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5,
    req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'

  next()
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  
    const tours = await features.query

    res.status(200).json({
      status: 'SUCCCESS',
      results: tours.length,
      data: { tours }
    })
  } catch (error) {
    res.status(404).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'SUCCESS',
      data: { tour }
    })
  } catch (error) {
    res.status(404).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const tour = Tour.create(req.body);

    res.status(201).json({
      status: 'SUCCESS',
      data: { tour }
    })
  } catch (error) {
    res.status(400).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    res.status(200).json({
      status: 'SUCCESS',
      data: { tour }
    })
  } catch (error) {
    res.status(404).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status({
      status: 'SUCCESS'
    })
  } catch (error) {
    res.status(404).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ])

    res.status(200).json({
      status: 'SUCCESS',
      data: { stats }
    })
  } catch (error) {
    res.status(404).json({
      status: 'FAIL',
      message: error
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}