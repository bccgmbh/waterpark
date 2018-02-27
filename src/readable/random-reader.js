const {Readable} = require('stream')
const crypto = require('crypto')

class RandomReader extends Readable {
  /**
   * Streams random buffer / strings
   * @param length total buffer length produced by the stream (encoding might vary the outcome)
   * @param encoding Setting encoding forces objectMode.
   * @param options {} Stream options for readables
   *
   * Use options.highWaterMark to adjust the default reading chunk size
   */
  constructor (length, encoding = null, options = {}) {
    options.objectMode = (encoding !== null)
    super(options)
    this.length = length || Number.POSITIVE_INFINITY
    this.encoding = encoding || null
  }

  _read (size) {
    // trim size if necessary
    if (size > this.length) size = this.length
    // signal EOF after 'length' bytes have been read
    if (size === 0) return this.push(null)
    // reduce remaining number of bytes to stream
    this.length -= size
    if (this.encoding === null) {
      // objectMode = false, push buffer
      this.push(crypto.randomBytes(size))
    } else {
      // objectMode = true, push string
      this.push(crypto.randomBytes(size).toString(this.encoding))
    }
  }
}

module.exports = {
  RandomReader,
  random: (length, encoding, options) => new RandomReader(length, encoding, options)
}
