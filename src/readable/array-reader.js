const { Readable } = require('stream')

function fromArray (array, options = {}) {
  if (typeof array[Symbol.iterator] === 'function') {
    return Readable.from(array, options)
  }
  throw new Error('Parameter is not iterable!')
}

fromArray.buf = (array, options = {}) => {
  options.objectMode = false
  if (typeof array[Symbol.iterator] === 'function') {
    return Readable.from(array, options)
  }
  throw new Error('Parameter is not iterable!')
}

module.exports = { fromArray }
