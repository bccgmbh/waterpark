const {fork} = require('child_process')
const {concurrent} = require('./concurrent-transform')

module.exports.multicore = (path, cores = 1, options = {}) => {
  const children = []

  for (let i = 0; i < cores; i++) {
    children.push(fork(path))
  }

  const transform = concurrent({
    ...options,
    objectMode: true,
    concurrency: cores,
    transform: function multicoreTransform (data, encoding, cb) {
      const idleChild = children.find((child) => !child.hasOwnProperty('cb'))
      if (!idleChild) throw new Error('No idle idleChild available!')
      idleChild.cb = cb
      idleChild.send(data)
    }

  })

  children.forEach((child, index) => {
    child.on('message', (msg) => {
      const cb = child.cb
      delete child.cb
      cb(null, msg)
    })
  })

  transform.on('end', () => {
    children.forEach(child => child.disconnect())
  })

  return transform
}
