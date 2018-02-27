const {Writable} = require('stream')

class ConsoleWriter extends Writable {
  constructor (options = {}) {
    super(options)
  }

  _write (chunk, encoding = 'utf8', callback) {
    console.log(chunk.toString(encoding))
    callback()
  }
}

module.exports = {
  ConsoleWriter,
  consoleWriter: (options) => new ConsoleWriter(options)
}
