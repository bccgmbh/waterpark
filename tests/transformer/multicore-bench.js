const tape = require('tape')
const {multicore, range, through} = require('../../')
// const debug = require('debug')('multicore-spec')
const worker = require.resolve('./multicore-sub.js')

module.exports = (cores) => {
  return tape(`[MulticoreTransform] Benchmark MulticoreTransform with ${cores}x core`, t => {
    const startTime = Date.now()
    range(1, 10 * cores)
      .pipe(through((data, encoding, cb) => cb(null, data.toString())))
      .pipe(multicore(worker, cores))
      .pipe(through((data, encoding, cb) => {
        // debug(data)
        cb(null)
      }))
      .on('finish', () => {
        const duration = Date.now() - startTime
        // debug(`END after ${duration}ms`)
        t.ok(true, `stream ends after ${duration}ms`)
        t.end()
      })
  })
}
