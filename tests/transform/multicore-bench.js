const tape = require('tape')
const {multicore, range} = require('../../')
const worker = require.resolve('./multicore-sub.js')

module.exports = (cores) => {
  return tape(`[MulticoreTransform] Benchmark MulticoreTransform with ${cores}x core`, t => {
    const startTime = Date.now()
    range(1, 12)
      .pipe(multicore(cores, worker))
      .on('data', () => {})
      .on('end', () => {
        const duration = Date.now() - startTime
        t.ok(true, `stream ends after ${duration}ms`)
        t.end()
      })
  })
}
