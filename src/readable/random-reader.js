const {Readable} = require('stream')
const crypto = require('crypto')

const random = (options) => {
  return new Readable({
    ...options,
    objectMode: true,
    read: function () {
      this.push(Math.random())
    }
  })
}

random.buf = (options) => {
  return new Readable({
    ...options,
    objectMode: false,
    read: function (size) {
      this.push(crypto.randomBytes(size))
    }
  })
}

module.exports = {
  random
}
