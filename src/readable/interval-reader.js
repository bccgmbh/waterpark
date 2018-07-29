const {Readable} = require('stream')

class IntervalReader extends Readable {
  constructor (interval, options = {}) {
    super(options)
    this.handle = setInterval(() => {
      this.push(Date.now().toString())
    }, interval)
  }

  _read () {}

  _destroy () {
    clearInterval(this.handle)
  }
}

// call signatures

const interval = (milliseconds, options = {}) => {
  if (typeof milliseconds === 'number') {
    return new IntervalReader(milliseconds, options)
  }
  return new IntervalReader(milliseconds)
}

interval.buf = (milliseconds, options = {}) => {
  if (typeof milliseconds === 'number') {
    return new IntervalReader(milliseconds, {...options, objectMode: false})
  }
  return new IntervalReader({...milliseconds, objectMode: false})
}

module.exports = {interval}
