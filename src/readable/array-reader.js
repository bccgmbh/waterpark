const { Readable } = require('stream')

/**
 * Object stream of elements form an array
 */
class FromArrayReader extends Readable {
  constructor (arr, options = {}) {
    if (!Array.isArray(arr)) throw new TypeError('Expecting Array')
    super(Object.assign({ objectMode: true }, options))
    this.arr = arr.reverse()
  }

  _read (size) {
    while (size--) {
      if (this.arr.length > 0) {
        this.push(this.arr.pop())
      } else {
        this.push(null)
        break
      }
    }
  }
}

// call signatures

function fromArray (array, options = {}) {
  if (Array.isArray(array)) {
    return new FromArrayReader(array, { ...options, objectMode: true })
  }
  return new FromArrayReader({ ...array, objectMode: true })
}

fromArray.buf = (array, options = {}) => {
  if (Array.isArray(array)) {
    return new FromArrayReader(array, { ...options, objectMode: false })
  }
  return new FromArrayReader({ ...array, objectMode: false })
}

module.exports = { fromArray }
