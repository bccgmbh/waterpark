const { Transform } = require('stream')

class DelayTransform extends Transform {
  constructor (millis, jitter = 0, options = {}) {
    super(options)
    this.millis = millis
    this.jitter = Math.min(millis, jitter)
  }

  _transform (chunk, encoding, callback) {
    setTimeout(() => {
      callback(null, chunk)
    }, this.millis + 2 * (Math.random() - 0.5) * this.jitter)
  }
}

// Call signature

function delay (milliseconds, jitter, options = {}) {
  if (typeof milliseconds === 'number') {
    return new DelayTransform(milliseconds, jitter, { ...options, objectMode: true })
  }
  return new DelayTransform({ ...milliseconds, objectMode: true })
}

delay.buf = (milliseconds, jitter, options = {}) => {
  if (typeof milliseconds === 'number') {
    return new DelayTransform(milliseconds, jitter, { ...options, objectMode: false })
  }
  return new DelayTransform({ ...milliseconds, objectMode: false })
}

module.exports = { delay }
