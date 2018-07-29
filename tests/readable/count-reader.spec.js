const tape = require('tape')
const {count, take} = require('../..')

tape('count in object mode', t => {
  t.plan(100 + 1)
  const offset = -20
  let counter = offset
  count(offset)
    .pipe(take(100))
    .on('data', data => {
      t.equal(data, counter++, 'counting ' + data)
    })
    .on('end', () => t.ok(true, 'Stream ends'))
})

tape('count in buffer mode', t => {
  const max = 100
  const offset = 2147483600
  t.plan(max + 1)
  let counter = offset - 1
  count.buf(offset)
    .pipe(take.buf(6 * 100))
    .on('data', data => {
      const actual = data.readIntBE(0, 6)
      t.ok(actual - counter === 1, 'counting ' + data.toString('hex') + ' => ' + actual)
      counter = actual
    })
    .on('end', () => t.ok(true, 'Stream ends'))
})
