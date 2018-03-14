const {Transform} = require('stream')

// Slice bytes (buffer mode)
function slice ({begin, end, every, ...options} = {}) {
  if (options.objectMode) return slice.obj(...arguments)
  begin = begin || 0
  end = end || Number.POSITIVE_INFINITY
  every = every || Number.POSITIVE_INFINITY
  let offset = 0

  return new Transform({
    ...options,
    objectMode: false,
    transform (chunk, encoding, next) {
      let consumed = 0
      let idx = offset % every
      while (consumed < chunk.length) {
        // const buf = chunk.slice(cursor, cursor + every)
        // cursor += every

        const from = Math.max(0, begin + consumed - idx)
        const to = Math.max(0, end + consumed - idx)

        // Values for next round
        offset += Math.min(chunk.length, every)
        consumed += Math.min(chunk.length, every)
        idx = offset % every
        console.log('[Slice] begin %d, end %d, every %d, idx %d, chunk %s', from, to, every, idx, chunk)
        this.push(chunk.slice(from, to))
      }
      // const consumed = buf.length - end
      next()
      // console.log('[Slice] ', chunk)
      // if (idx < begin) {

      // }
      // next(null, chunk)
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
