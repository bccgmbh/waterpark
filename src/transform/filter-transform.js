const {Transform} = require('stream')

function filter ({filter: fn, ...options}) {
  return new Transform({
    objectMode: true,
    ...options,
    transform (chunk, encoding, cb) {
      if (fn(chunk)) {
        this.push(chunk)
      }
      cb()
    }
  })
}

filter.buf = ({filter, ...options}) => filter({filter, ...options, objectMode: false})

module.exports = {
  filter
}
