const {Readable} = require('stream')

/**
 * Creates a finite stream of integer numbers.
 * ObjectMode will be set to true.
 */
class RangeReader extends Readable {
  constructor ({from = 0, to = Number.POSITIVE_INFINITY, objectMode = true, ...options} = {}) {
    super({objectMode, ...options})
    this.current = from
    // direction aware step and break condition
    this.step = (from <= to)
      ? objectMode ? () => this.current++ : () => numberToIntBEBuffer(this.current++)
      : objectMode ? () => this.current-- : () => numberToIntBEBuffer(this.current--)
    this.condition = (from <= to) ? () => this.current <= to : () => this.current >= to
  }

  _read () {
    if (this.condition()) {
      this.push(this.step())
    } else {
      this.push(null)
    }
  }
}

function range (from, to, options) {
  if (typeof from === 'object') {
    return new RangeReader(from)
  }
  return new RangeReader({from, to, ...options})
}

range.buf = (from, to, options) => {
  if (typeof from === 'object') {
    return new RangeReader({...from, objectMode: false})
  }
  return new RangeReader({from, to, ...options, objectMode: false})
}

range.BUFFER_SIZE = 6

function numberToIntBEBuffer (num) {
  const buf = Buffer.allocUnsafe(6)
  buf.writeIntBE(num, 0, 6)
  return buf
}

/**
 * Shorthand factory for RangeReader
 * @param {number} from MUST be an integer
 * @param {number} to MUST be an integer
 * @param options Stream options
 */
module.exports = {
  RangeReader,
  range
}
