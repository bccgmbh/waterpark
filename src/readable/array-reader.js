const {Readable} = require('stream')

/**
 * Object stream of elements form an array
 */
class FromArrayReader extends Readable {
  constructor (arr, options = {}) {
    if (!Array.isArray(arr)) throw new TypeError('Expecting Array')
    options.objectMode = true
    super(options)
    this.arr = arr
  }

  _read (size) {
    for (let k = 0; k < size; k++) {
      if (this.arr.length > 0) {
        this.push(this.arr.pop())
      } else {
        this.push(null)
        break
      }
    }
  }
}

module.exports = {
  FromArrayReader,
  fromArray: (arr, options) => new FromArrayReader(arr, options)
}