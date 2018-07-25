const {Readable} = require('stream')

const count = ({offset = 0, ...options}) => {
  return new Readable({
    ...options,
    objectMode: true,
    read: function () {
      this.push(offset++)
    }
  })
}

/**
 * counts Int32 big endian buffer in positive direction.
 * Attention: after 2147483647 it will jump back to -2147483647
 * @param offset {number} between -2147483647 and 2147483647
 * @param options
 */
count.buf = ({offset = 0, ...options}) => {
  return new Readable({
    ...options,
    objectMode: false,
    read: function () {
      const buf = Buffer.allocUnsafe(4)
      buf.writeInt32BE(offset, 0)
      if (offset === 0x7fffffff) {
        offset = -0x7fffffff
      } else {
        offset++
      }
      this.push(buf)
    }
  })
}

module.exports = {
  count
}
