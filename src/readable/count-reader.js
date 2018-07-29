const {Readable} = require('stream')

function countObjectReader ({offset = 0, ...options} = {}) {
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
function countBufferReader ({offset = 0, ...options} = {}) {
  return new Readable({
    ...options,
    objectMode: false,
    read: function () {
      const buf = Buffer.allocUnsafe(6)
      buf.writeIntBE(offset++, 0, 6)
      this.push(buf)
    }
  })
}

// call signatures

const count = (offset, options = {}) => {
  if (typeof offset === 'number') {
    return countObjectReader({offset, options})
  }
  return countObjectReader(offset)
}

count.buf = (offset, options = {}) => {
  if (typeof offset === 'number') {
    return countBufferReader({offset, ...options, objectMode: true})
  }
  return countObjectReader({...offset, objectMode: true})
}

module.exports = {count}
