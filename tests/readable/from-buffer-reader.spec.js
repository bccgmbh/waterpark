const tape = require('tape')
const {fromBuffer} = require('../../')

tape('[BufferReader] reads bytes from buffer', t => {
  const buf = Buffer.from('abc')
  t.plan(2)
  fromBuffer.buf(buf)
    .on('data', data => {
      t.ok(Buffer.isBuffer(data), 'read buffer from buffer')
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[BufferReader] reads bytes from buffer in object mode', t => {
  const buf = Buffer.from('abc')
  t.plan(3)
  fromBuffer(buf, {highWaterMark: 2})
    .on('data', data => {
      t.ok(Buffer.isBuffer(data), 'read buffer from buffer ' + data)
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[BufferReader] with highWaterMark', t => {
  const buf = Buffer.from('abcdefghijk')
  t.plan(7)
  fromBuffer.buf(buf, {highWaterMark: 2})
    .on('data', data => {
      t.ok(Buffer.isBuffer(data), 'read buffer from buffer')
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[BufferReader] complains for not providing a buffer', t => {
  t.throws(() => fromBuffer('not a buffer'), 'Throws exception if no buffer has been provided')
  t.throws(() => fromBuffer(), 'Throws exception if no buffer has been provided')
  t.end()
})
