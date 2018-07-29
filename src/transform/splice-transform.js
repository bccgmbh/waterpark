const Transform = require('stream')

function spliceObjects ({start, skip, insert, every, ...options} = {}) {
  return new Transform({
    ...options,
    objectMode: true,
    transform (data, encoding, cb) {
      cb(new Error('Not yet implemented!'))
    }
  })
}

function splice (start, skip, insert, every, options) {
  if (typeof start === 'number') {
    return spliceObjects({start, skip, insert, every, ...options})
  }
  return spliceObjects(start)
}

module.exports = {splice}
