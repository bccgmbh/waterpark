const {Transform} = require('stream')

module.exports.filter = (fn, options) => {
  return new Transform({
    ...options,
    objectMode: true,
    transform (chunk, encoding, cb) {
      if (fn(chunk)) {
        this.push(chunk)
      }
      cb()
    }
  })
}
