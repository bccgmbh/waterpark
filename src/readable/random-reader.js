const { Readable } = require('stream')
const crypto = require('crypto')

// STREAMS

function randomObjectReader ({ size = 16, ...options } = {}) {
  const length = Math.ceil(size / 2)
  return new Readable({
    ...options,
    objectMode: true,
    read: function () {
      this.push(crypto
        .randomBytes(length)
        .toString('hex')
        .substring(0, size)
      )
    }
  })
}

function randomBufferReader (options) {
  return new Readable({
    ...options,
    objectMode: false,
    read: function (size) {
      this.push(crypto.randomBytes(size))
    }
  })
}

// SYNTACTIC SUGAR

function random (size, options = {}) {
  if (typeof size === 'number') {
    return randomObjectReader({ size, ...options })
  }
  return randomObjectReader(size)
}

random.buf = (size, options = {}) => {
  if (typeof size === 'number') {
    options.highWaterMark = size
  }
  return randomBufferReader(size)
}

module.exports = { random }
