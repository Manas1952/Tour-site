class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString } // in 'queryObj = queryString' queryObj will reference to queryString and doesn't create a copy, so we destructure it again make object to assign copy of it to 'queryObj'
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(field => delete queryObj[field])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // like replacing 'gt' with '$gt' for mongodb

    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt') // '-' signifies descending order of 'caretedAt'
    }

    return this
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.queryString.fields.split(',')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v') // doesn't include extra field '__v" (created by mongodb)
    }

    return this
  }

  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures