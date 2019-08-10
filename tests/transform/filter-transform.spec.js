const tape = require('tape')
const { range, fromBuffer, filter } = require('../../')

tape('[Filter] object stream', t => {
  const result = [1, 3, 5]
  t.plan(4)

  range(1, 5)
    .pipe(filter({ test: n => n % 2 })) // filter odd numbers
    .on('data', data => {
      t.equal(data, result.shift(), `filtered odd numbers ${data}`)
    })
    .on('end', () => t.ok(true, 'Filter stream should end'))
})

tape('[Filter] buffer stream', t => {
  t.plan(2)
  const source = Buffer.from('020801', 'hex')
  const result = ['02', '01'].map(str => Buffer.from(str, 'hex'))
  fromBuffer.buf(source, { highWaterMark: 1 })
    .pipe(filter.buf((buffer) => buffer[0] < 4))
    .on('data', buffer => t.ok(buffer.equals(result.shift()), 'buffer stream filtered ' + buffer.toString('hex')))
})
