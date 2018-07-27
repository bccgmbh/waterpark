const {Transform} = require('stream')

// Slice bytes (buffer mode)
function slice ({begin, end, every, ...options} = {}) {
  if (options.objectMode) return slice.obj(...arguments)
  begin = begin || 0
  end = end || Number.POSITIVE_INFINITY
  every = every || Number.POSITIVE_INFINITY
  let offset = 0

  // slice ({begin: 10, end: 20, every: 30})
  // 0         10        20        30        40        50        60...
  // |xxxxxxxxx|+++++++++|xxxxxxxxx|xxxxxxxxx|+++++++++|xxxxxxxxx|
  //           ^begin    ^end      ^every    ^begin    ^end      ^every
  //                 ============================
  // ^prev_1         ^offset       ^prev_2       ^offset + chunk.length
  //
  // chunk:  =
  // ignore: x
  // stream: +

  return new Transform({
    ...options,
    objectMode: false,
    transform (chunk, encoding, next) {
      let cursor = offset
      while (cursor < offset + chunk.length) {
        const prev = cursor - cursor % every
        const from = Math.max(cursor, prev + begin) - offset
        const to = Math.min(prev + end, offset + chunk.length) - offset
        // console.log('[Slice] [%s (%s - %s) %s]',
        //   offset.toString().padStart(8),
        //   (offset + from).toString().padStart(8),
        //   (offset + to - 1).toString().padStart(8),
        //   (offset + chunk.length - 1).toString().padStart(8)
        // )
        if (from < to) {
          this.push(chunk.slice(from, to))
        }
        cursor = Math.min(prev + every, offset + chunk.length)
      }
      offset += chunk.length
      if (every === Number.POSITIVE_INFINITY && offset > end) {
        return this.push(null)
      }
      next()
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
