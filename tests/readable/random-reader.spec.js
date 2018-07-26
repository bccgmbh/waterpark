const tape = require('tape')
const {random} = require('../../')

// const DEFAULT_HIGH_WATERMARK = 16384

tape('[RandomReader] default random number stream', t => {
  let count = 10
  t.plan(count)
  const rr = random()
    .on('data', data => {
      t.equal(typeof data, 'number', 'random number ' + data)
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})

tape('[RandomReader] default random buffer stream', t => {
  let count = 3
  t.plan(count * 2)
  const HIGH_WATERMARK = 8
  const rr = random.buf({highWaterMark: HIGH_WATERMARK})
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
  const rr = random.buf({highWaterMark, encoding: 'hex'})
    .on('data', data => {
      t.equal(data.length, highWaterMark * 2, 'Random buffer length equals highWatermark')
      t.equal(typeof data, 'string', 'Type of data should be string')
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})
