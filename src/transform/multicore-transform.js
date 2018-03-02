const {fork} = require('child_process')
const parallel = require('parallel-transform')
// const debug = require('debug')('multicore')

const multicore = (path, cores = 1) => {
  const children = []

  // debug('with %d cores', cores)
  for (let i = 0; i < cores; i++) {
    children.push(fork(path))
    // debug('Forked sub process %d', children[i].pid)
  }

  const transform = parallel(
    cores,
    {
      // highWaterMark: cores,
      objectMode: true
    },
    function (data, cb) {
      const idleChild = children.find((child) => !child.hasOwnProperty('cb'))
      if (!idleChild) throw new Error('No idle idleChild available!')

      // debug('%s => %d', data.padStart(3), idleChild.pid)
      idleChild.cb = cb
      idleChild.send(data)
    }
  )

  children.forEach((child, index) => {
    child.on('message', (msg) => {
      // debug('%s <= %d | %s', msg[0].padStart(3), child.pid, msg[1])
      const cb = child.cb
      delete child.cb
      cb(null, msg[1])
    })
  })

  transform.on('end', () => {
    children.forEach(child => child.disconnect())
  })

  return transform
}

module.exports = {
  multicore
}
