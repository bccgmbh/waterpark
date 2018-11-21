const {Transform} = require('stream')

const concurrentTransform = ({concurrency = 1, transform, ...options}) => {
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

      function next (err, data) {
        capacity++
        if (err) {
          this.emit('error', err)
          this.destroy()
          return
        }
        if (data !== undefined) this.push(data)
        nextEventually(data)
      }

      const boundNext = next.bind(this)
      transform.call(this, chunk, encoding, boundNext)
      nextEventually()
    },
    flush (cb) {
      flushCb = cb
      flushEventually()
    }
  })
}

// call signature

function concurrent (concurrency, transform, options = {}) {
  if (typeof concurrency === 'number') {
    return concurrentTransform({concurrency, transform, ...options})
  }
  return concurrentTransform(concurrency)
}

concurrent.buf = (concurrency, transform, options = {}) => {
  if (typeof concurrency === 'number') {
    return concurrentTransform({concurrency, transform, ...options, objectMode: false})
  }
  return concurrentTransform({...concurrency, objectMode: false})
}

module.exports = {concurrent}
