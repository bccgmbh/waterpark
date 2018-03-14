const {Readable} = require('stream')

/**
 * Creates a finite stream of integer numbers.
 * ObjectMode will be set to true.
 */
class RangeReader extends Readable {
  constructor ({from = 0, to = Number.POSITIVE_INFINITY, ...options}) {
    options.objectMode = true
    super(options)
    this.current = from
    // direction aware step and break condition
    this.step = (from <= to) ? () => this.current++ : () => this.current--
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

/**
 * Shorthand factory for RangeReader
 * @param {number} from MUST be an integer
 * @param {number} to MUST be an integer
 * @param options Stream options
 */
module.exports = {
  RangeReader,
  range: (from, to, options) => {
    if (
      arguments.length === 1 &&
      typeof from === 'object'
    ) {
      return new RangeReader(from)
    }
    return new RangeReader({from, to, ...options})
  }
}
