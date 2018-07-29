const {Transform} = require('stream')

function filterTransform ({test, ...options}) {
  return new Transform({
    objectMode: true,
    ...options,
    transform (chunk, encoding, cb) {
      if (test(chunk)) {
        this.push(chunk)
      }
      cb()
    }
  })
}

// call signatures

const filter = (test, options = {}) => {
  if (typeof test === 'function') {
    return filterTransform({test, ...options})
  }
  return filterTransform(test)
}

filter.buf = (test, options) => {
  if (typeof test === 'function') {
    return filterTransform({test, ...options, objectMode: false})
  }
  return filterTransform({...test, objectMode: false})
}

module.exports = {filter}
