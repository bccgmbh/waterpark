const {Transform} = require('stream')

class TakeTransform extends Transform {
  constructor (amount, every, options = {}) {
    options.objectMode = true
    super(options)
    this.every = every || 0
    this.amount = amount
    this.count = -1
  }

  _transform (data, encoding, cb) {
    if (this.every === 0) {
      this.count++
    } else {
      this.count = ++this.count % (this.every)
    }

    // console.log(`count ${this.count}, amount ${this.amount}, data ${data}`)
    if (this.count < this.amount - 1) {
      return cb(null, data)
    } else if (this.count === this.amount - 1) {
      cb(null, data)
    } else if (this.count >= this.amount) {
      cb()
    }

    if (this.every === 0) {
      // take only once
      process.nextTick(() => this.destroy())
    }
  }
}

module.exports = {
  TakeTransform,
  take: (amount, every, options) => new TakeTransform(amount, every, options)
}
