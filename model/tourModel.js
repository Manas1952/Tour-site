const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less than or equal to characters '],
    minlength: [2, 'A tour name must have more than or equal to ']
  },
  
})