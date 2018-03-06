const tape = require('tape')
const {multicore, range, through} = require('../../')
const worker = require.resolve('./multicore-sub.js')

module.exports = (cores) => {
  return tape(`[MulticoreTransform] Benchmark MulticoreTransform with ${cores}x core`, t => {
    const startTime = Date.now()
    range(1, 12)
      .pipe(multicore(worker, cores))
      .pipe(through((data, encoding, cb) => {
        cb()
      }))
      .on('finish', () => {
        const duration = Date.now() - startTime
        t.ok(true, `stream ends after ${duration}ms`)
        t.end()
      })
  })
}
