const {Transform} = require('stream')

function pause ({interval, duration, target, ...options}) {
  if (interval < 1 || !Number.isInteger(interval)) {
    throw new Error('interval must be a positive integer')
  }
  if (!(duration >= 0)) {
    throw new Error('duration must be a positive number or 0')
  }
  let counter = 0
  const self = new Transform({
    ...options,
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

pause.obj = (options = {}) => pause(({...options, objectMode: true}))

module.exports = {pause}
