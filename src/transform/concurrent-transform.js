const {Transform} = require('stream')

module.exports.concurrent = ({concurrency = 1, transform, ...options}) => {
  let capacity = concurrency
  let flushCb // flush callback

  function flushEventually () {
    if (!!flushCb && capacity === concurrency) {
      // console.log('[concurrent] FLUSH')
      flushCb()
    }
  }

  return new Transform({
    objectMode: true,
    ...options,
    transform (chunk, encoding, cb) {
      // console.log('[concurrent] transform with capacity', capacity)
      capacity--
      if (capacity > 0) {
        transform(chunk, encoding, (err, data) => {
          capacity++
          if (err) return this.emit('error', err)
          if (data === undefined) return
          this.push(data)
          flushEventually()
        })
        cb()
      } else {
        transform(chunk, encoding, (err, data) => {
          capacity++
          cb(err, data)
          flushEventually()
        })
      }
    },
    flush (cb) {
      flushCb = cb
      flushEventually()
      // console.log('[concurrent] upstream depleted at capacity', capacity)
    }
  })
}
