const tape = require('tape')
const {interval, take} = require('../../')

tape('[IntervalReader] interval(100).pipe(take(3)) should porperly terminate around 300ms', t => {
  t.plan(4)
  const startTime = Date.now()
  const ir = interval(100)
  ir.pipe(take(3))
    .on('data', (data) => t.ok(data, `interval emitted ${Date.now() - startTime}`))
    .on('finish', () => {
      // console.log('[TEST] destroy IntervalReader ' + Date.now())
      ir.destroy()
      const endTime = Date.now()
      const duration = endTime - startTime
      // console.log('[IntervalReader] start %d, end %d, duration %d', startTime, endTime, duration)
      t.ok(duration > 270 && duration < 330, 'interval for 3 x 100ms took ' + duration + 'ms')
    })
})
