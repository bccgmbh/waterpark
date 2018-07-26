const tape = require('tape')
const {random} = require('../../')
// const debug = require('debug')('wp-spec-reader-random')

const DEFAULT_HIGH_WATERMARK = 16384

tape('[RandomReader] Random stream (default: infinite buffer)', t => {
  let count = 3
  t.plan(count * 2)
  const rr = random()
    .on('data', data => {
      // console.log('[TEST:RANDOM] buffer length %s', data.toString('hex'))
      t.ok(Buffer.isBuffer(data), 'random buffer produced')
      t.equal(data.length, DEFAULT_HIGH_WATERMARK, 'Random buffer should have default highWatermark')
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})

tape('[RandomReader] infinite buffer stream with highWaterMark', t => {
  let count = 3
  t.plan(count * 2)
  const HIGH_WATERMARK = 20
  const rr = random(null, null, {highWaterMark: HIGH_WATERMARK})
    .on('data', data => {
      t.ok(Buffer.isBuffer(data), 'random buffer produced')
      t.equal(data.length, HIGH_WATERMARK, 'Random buffer should have specified highWatermark')
      if (--count < 1) {
        rr.pause()
        rr.destroy()
      }
    })
})

tape('[RandomReader] infinite hex encoded stream', t => {
  let count = 3
  t.plan(count * 2)
  const highWaterMark = 20
  const rr = random(null, 'hex', {objectMode: true, highWaterMark}).on('data', data => {
    t.equal(data.length, highWaterMark * 2, 'Random buffer should have specified highWatermark')
    t.equal(typeof data, 'string', 'Type of data should be string')
    if (--count < 1) {
      rr.pause()
      rr.destroy()
    }
  })
})

tape('[RandomReader] finite buffer stream', t => {
  let count = 0
  const LENGTH = 20000
  random(LENGTH).on('data', data => {
    t.ok(Buffer.isBuffer(data), 'Data should be a buffer')
    count += data.length
    // debug('[Test.FiniteBuffer] count %d', count)
  }).on('end', () => {
    t.equal(count, LENGTH, 'Total bytes should equal specified length')
    t.end()
  })
})

tape('[RandomReader] finite hex stream', t => {
  let count = 0
  const LENGTH = 20
  random(LENGTH, 'hex').on('data', data => {
    t.ok((typeof data === 'string'), 'Data should be a string')
    count += data.length
  }).on('end', () => {
    // hex string requires 2 characters to encode one byte
    t.equal(count, LENGTH * 2, 'Total bytes should equal specified length')
    t.end()
  })
})

tape('[RandomReader] finite ascii stream with options', t => {
  let count = 0
  const LENGTH = 20
  random(LENGTH, 'ascii', {highWaterMark: 1000}).on('data', data => {
    t.ok((typeof data === 'string'), 'Data should be a string')
    count += data.length
  }).on('end', () => {
    t.equal(count, LENGTH, 'Total bytes should equal specified length')
    t.end()
  })
})
