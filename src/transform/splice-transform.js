const Transform = require('stream')

module.exports.splice = (start, skip, insert, every, options) => {
  return new Transform({
    ...options,
    objectMode: true,
    transform (data, encoding, cb) {
      cb(new Error('Not yet implemented!'))
    }
  })
}
