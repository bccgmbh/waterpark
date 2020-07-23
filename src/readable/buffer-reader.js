const { Readable } = require('stream')

/**
 * Buffer stream from a buffer
 */
class FromBufferReader extends Readable {
  constructor (buf, options = {}) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('Expecting Buffer!')
    super(options)
    this.buf = buf
    this.index = 0
  }

  _read (size) {
    if (this.buf.length === this.index) {
      return this.push(null)
    }
    const buf = this.buf.slice(this.index, this.index + size)
    this.index = Math.min(this.buf.length, this.index + size)
    return this.push(buf)
  }
}

// call signatures

function fromBuffer (buf, options = {}) {
  if (Buffer.isBuffer(buf)) {
    return new FromBufferReader(buf, { ...options, objectMode: true })
  }
  throw new Error('First parameter must be a Buffer!')
}

fromBuffer.buf = (buf, options = {}) => {
  if (Buffer.isBuffer(buf)) {
    return new FromBufferReader(buf, { ...options, objectMode: false })
  }
  throw new Error('First parameter must be a Buffer!')
}

module.exports = { fromBuffer }
