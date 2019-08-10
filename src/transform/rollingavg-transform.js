const { Transform } = require('stream')

module.exports.rollingAvg = (length, options) => {
  const history = []
  let avg = 0
  let sum = 0
  return new Transform({
    ...options,
    objectMode: true,
    transform (n, encoding, cb) {
      history.push(n)
      if (history.length < length) {
        sum += n
        cb()
      } else {
        sum = sum + n
        avg = sum / length
        sum = sum - history.shift()
        cb(null, avg)
      }
    }
  })
}
