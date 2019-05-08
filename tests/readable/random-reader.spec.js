const tape = require('tape')
const { random, take } = require('../../')

// const DEFAULT_HIGH_WATERMARK = 16384

tape('[RandomReader] default random hex stream', t => {
  t.plan(9)
  random()
    .pipe(take(8))
    .on('data', data => {
      t.equal(typeof data, 'string', 'random string ' + data)
    })
    .on('end', () => t.pass('END'))
})

tape('[RandomReader] random hex stream with fixed chunk length', t => {
  t.plan(9)
  random(5)
    .pipe(take(4))
    .on('data', data => {
      t.equal(typeof data, 'string', 'random string ' + data)
      t.equal(data.length, 5, 'fixed string length')
    })
    .on('end', () => t.pass('END'))
})

tape('[RandomReader] default random buffer stream', t => {
  let count = 3
  t.plan(count * 2)
  const HIGH_WATERMARK = 8
  const rr = random.buf({ highWaterMark: HIGH_WATERMARK })
    .on('data', data => {
      t.ok(Buffer.isBuffer(data), 'buffer emitted')
      t.equal(data.length, HIGH_WATERMARK, 'Random buffer should have specified highWatermark ' + data.toString('hex'))
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})

tape('[RandomReader] hex encoded random stream', t => {
  let count = 3
  t.plan(count * 2)
  const highWaterMark = 20
  const rr = random.buf({ highWaterMark, encoding: 'hex' })
    .on('data', data => {
      t.equal(data.length, highWaterMark * 2, 'Random buffer length equals highWatermark')
      t.equal(typeof data, 'string', 'Type of data should be string')
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})
