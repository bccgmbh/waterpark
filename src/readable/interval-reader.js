const {Readable} = require('stream')

class IntervalReader extends Readable {
  constructor (interval, options = {}) {
    super(options)
    this.handle = setInterval(() => {
      // console.log('[IntervalReader] setIntervall.cb ' + Date.now())
      this.push(Date.now().toString())
    }, interval)
  }

  _read () {}

  _destroy () {
    clearInterval(this.handle)
  }
}

module.exports = {
  IntervalReader,
  interval: (interval, options) => new IntervalReader(interval, options)
}