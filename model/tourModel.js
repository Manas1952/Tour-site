const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than or equal to characters 40'],
      minlength: [2, 'A tour name must have more than or equal to 2']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration(in days)']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // 'this' only points to current doc on NEW document creation, not on updates
          return value < this.price
        },
        message: 'Discount price ({VALUE}) should be below regular price' // '({VALUE})' is functionality by mongoose (value of priceDiscount) 
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    // whenever output is gotten as JSON or Object, add virtual properties to it
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true }) // slugify the name ('tour 1' -> 'tour-1')
  next()
})

// this is middleware for query, not for document; 'this' references to current query, not document
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next()
})

tourSchema.post('aggregate', function(docs, next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }  // 'this.pipeline()' returns array of stages, so we add one more stage at starting of this stages[] by 'unshift()'.
  })
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour