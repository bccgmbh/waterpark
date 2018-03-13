const {Transform} = require('stream')

// Slice bytes (buffer mode)
function slice ({begin, end, every, ...options} = {}) {
  if (options.objectMode) return slice.obj(...arguments)
  return new Transform({
    ...options,
    objectMode: false,
    transform (chunk, encoding, next) {
      // console.log('[Slice] ', chunk)
      next('NYI')
    }
  })
}

// Slice objects (object mode)
slice.obj = function ({begin, end, every, ...options} = {}) {
  options.objectMode = true
  begin = begin || 0
  end = end || Number.POSITIVE_INFINITY
  every = every || Number.POSITIVE_INFINITY
  let index = 0

  return new Transform({
    ...options,
    objectMode: true,
    transform (data, encoding, next) {
      const idx = index++ % every
      // console.log('[Slice] idx %d, end %d, data %s', idx, end, data)
      if (begin <= idx && idx < end) {
        next(null, data)
      } else {
        next(null)
      }
      if (every === Number.POSITIVE_INFINITY && index === end) {
        process.nextTick(() => this.destroy())
      }
    },
    ...options
  })
}

module.exports = {slice}
