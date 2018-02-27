const {Readable} = require('stream')

/**
 * Creates a finite stream of integer numbers.
 * ObjectMode will be set to true.
 */
class RangeReader extends Readable {
  constructor (from, to, options = {}) {
    if (!Number.isFinite(from)) throw new Error('RangeReader expects first parameter (from) to be a number')
    if (!Number.isFinite(to)) throw new Error('RangeReader expects second parameter (to) to be a number')
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
  range: (from, to, options) => new RangeReader(from, to, options)
}
