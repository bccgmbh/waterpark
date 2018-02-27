const {Transform} = require('stream')

class DelayTransform extends Transform {
  constructor (millis, jitter = 0, options = {}) {
    super(options)
    this.millis = millis
    this.jitter = jitter
  }

  _transform (chunk, encoding, callback) {
    // console.log('[DelayTransform._transform] encoding %s', encoding);
    setTimeout(() => {
      callback(null, chunk)
    }, this.millis + 2 * (Math.random() - 0.5) * this.jitter)
  }
}

module.exports = {
  DelayTransform,
  delay: (milliseconds, jitter, options = {}) => {
    options.objectMode = true
    return new DelayTransform(milliseconds, jitter, options)
  },
  delayBuffer: (milliseconds, jitter, options) => {
    options.objectMode = false
    return new DelayTransform(milliseconds, jitter, options)
  }
}
