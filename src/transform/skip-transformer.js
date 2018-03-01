const {Transform} = require('stream')

module.exports.skipObjects = (amount, options = {}) => {
  if (!Number.isInteger(amount) || amount < 0) { throw new Error('"amount" must be a positive integer') }
  return new Transform(
    {
      objectMode: true,
      transform: (data, encoding, cb) => {
        if (amount === 0) {
          return cb(null, data)
        }
        amount--
        cb()
      },
      ...options
    }
  )
}

module.exports.skipBytes = (amount, options = {}) => {
  if (!Number.isInteger(amount) || amount < 0) { throw new Error('"amount" must be a positive integer') }
  return new Transform(
    {
      objectMode: false,
      transform (chunk, encoding, cb) {
        if (amount === 0) {
          cb(null, chunk)
        } else if (amount >= chunk.length) {
          amount -= chunk.length
          cb(null)
        } else if (amount < chunk.length) {
          const offset = amount
          amount = 0
          cb(null, chunk.slice(offset))
        }
      },
      ...options
    }
  )
}
