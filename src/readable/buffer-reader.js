const {Readable} = require('stream')

/**
 * Buffer stream from a buffer
 */
class FromBufferReader extends Readable {
  constructor (buf, options = {}) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('Expecting Buffer!')
    options.objectMode = false
    super(options)
    this.buf = buf
    this.index = 0
  }

  _read (size) {
    if (this.buf.length === this.index) {
      return this.push(null)
    }
    if (size >= this.buf.length - this.index) {
      const buf = this.buf.slice(this.index)
      this.index = this.buf.length
      return this.push(buf)
    }
    if (size < this.buf.length - this.index) {
      const buf = this.buf.slice(this.index, this.index + size)
      this.index += size
      return this.push(buf)
    }
  }
}

module.exports = {
  FromBufferReader,
  fromBuffer: (buf, options) => new FromBufferReader(buf, options)
}
