const tape = require('tape')
const { interval, take } = require('../../')

tape('[IntervalReader] interval(100).pipe(take(3)) should porperly terminate around 300ms', t => {
  t.plan(4)
  const startTime = Date.now()
  const ir = interval(100)
  ir.pipe(take(3))
    .on('data', (data) => t.ok(data, `interval emitted ${Date.now() - startTime}`))
    .on('end', () => {
      ir.destroy()
      const endTime = Date.now()
      const duration = endTime - startTime
      t.ok(duration > 270 && duration < 330, 'interval for 3 x 100ms took ' + duration + 'ms')
    })
})

tape('[IntervalReader] should support buffer mode', t => {
  t.plan(4)
  const startTime = Date.now()
  const ir = interval.buf(100)
  ir.pipe(take.buf(13 * 3))
    .on('data', (data) => t.ok(data, `buffer emitted ${data}`))
    .on('end', () => {
      ir.destroy()
      const endTime = Date.now()
      const duration = endTime - startTime
      t.ok(duration > 270 && duration < 330, 'interval for 3 x 100ms took ' + duration + 'ms')
    })
})
