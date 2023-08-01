const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect('mongodb://127.0.0.1:27017/tours')
.then(() => console.log('Connected to DB!'))

app.listen(8080, () => {
  console.log('Server is up on the port:', 8080)
})