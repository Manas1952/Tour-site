const express = require('express')
const userRoute = require('./routes/userRoute')
const tourRoute = require('./routes/tourRoute')

const app = express()

app.use(express.json())
app.use((req, res, next) => {
  console.log('Hello from middleware...')
  next()
})

app.use('/api/users', userRoute)
app.use('/api/tours', tourRoute)

module.exports = app