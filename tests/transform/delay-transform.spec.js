const tape = require('tape')
const { range, take, delay, random } = require('../../')

// const DEFAULT_HIGH_WATERMARK = 16384

tape('[Delay] an object stream', t => {
  t.plan(4)
  const start = Date.now()
  let count = 0.0
  const allowedDeviation = 0.1 // 10%
  const INTERVAL = 100
  range(1, 3)
    .pipe(delay(INTERVAL))
    .on('data', data => {
      count++
      const duration = Date.now() - start
      const expectedDuration = INTERVAL * count
      const deviation = Math.abs(duration - expectedDuration)
      const avDeviation = deviation / expectedDuration
      t.ok(avDeviation <= allowedDeviation, 'Stream delayed deviates by ' + (100 * avDeviation).toFixed(1) + '%')
    })
    .on('end', () => {
      t.ok(true, 'delay stream should end')
    })
})

tape('[Delay] buffer stream', t => {
  t.plan(5)
  random.buf({ highWaterMark: 10 })
    .pipe(take.buf(40))
    .pipe(delay.buf(100, 0))
    .on('data', buffer => {
      t.ok(Buffer.isBuffer(buffer), 'stream emitting buffer ' + buffer.toString('hex'))
    })
    .on('end', () => t.ok(true, 'delay stream should end'))
})
