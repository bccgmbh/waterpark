const {Transform} = require('stream')

module.exports.filter = ({filter, ...options}) => {
  return new Transform({
    ...options,
    objectMode: true,
    transform (chunk, encoding, cb) {
      if (filter(chunk)) {
        this.push(chunk)
      }
      cb()
    }
  })
}
