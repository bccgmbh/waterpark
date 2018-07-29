const {Transform} = require('stream')

function pauseObjectTransform ({interval, duration, target, ...options} = {}) {
  if (interval < 1 || !Number.isInteger(interval)) {
    throw new Error('interval must be a positive integer')
  }
  if (!(duration >= 0)) {
    throw new Error('duration must be a positive number or 0')
  }
  let counter = 0
  const self = new Transform({
    ...options,
    objectMode: true,
    transform: function (data, encoding, cb) {
      counter = (counter + 1) % interval
      if (!counter) {
        target.pause()
        setTimeout(() => {
          target.resume()
          cb(null, data)
        }, duration)
      } else {
        cb(null, data)
      }
    }
  })
  target = target || self
  return self
}

function pauseBufferTransform ({interval, duration, target, ...options} = {}) {
  throw new Error('NYI!')
}

const pause = (interval, duration, target, options = {}) => {
  if (typeof interval === 'number') {
    return pauseObjectTransform({interval, duration, target, ...options})
  }
  return pauseObjectTransform(interval)
}

pause.buf = (interval, duration, target, options = {}) => {
  if (typeof interval === 'number') {
    return pauseBufferTransform({interval, duration, target, ...options})
  }
  return pauseBufferTransform(interval)
}

module.exports = {pause}
