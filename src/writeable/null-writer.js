const {Writable} = require('stream')

class NullWriter extends Writable {
  _write (chunk, encoding, callback) {
    callback()
  }
}

module.exports = {
  NullWriter,
  drain: (options = {}) => new NullWriter(options),
  drainObjects: (options = {}) => new NullWriter(Object.assign(options, {objectMode: true}))
}
