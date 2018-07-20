const {Transform} = require('stream')

module.exports.concurrent = ({concurrency = 1, transform, ...options}) => {
  let capacity = concurrency
  let flushCb // flush callback
  const cbStack = []

  function nextEventually () {
    if (!capacity) return
    const next = cbStack.pop()
    if (next) next()
    flushEventually()
  }

  function flushEventually () {
    if (!!flushCb && capacity === concurrency) {
      flushCb()
    }
  }

  return new Transform({
    objectMode: true,
    ...options,
    transform (chunk, encoding, cb) {
      cbStack.push(cb)
      capacity--
      transform(chunk, encoding, (err, data) => {
        capacity++
        if (err) {
          this.emit('error', err)
          this.destroy()
          return
        }
        if (data !== undefined) this.push(data)
        nextEventually(data)
      })
      nextEventually()
    },
    flush (cb) {
      flushCb = cb
      flushEventually()
    }
  })
}
