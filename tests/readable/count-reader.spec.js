const tape = require('tape')
const {count} = require('../..')

tape('count in object mode', t => {
  t.plan(100 + 2)
  const offset = -20
  let counter = offset
  const stream = count({offset})
    .on('data', data => {
      t.equal(data, counter, 'counting ' + data)
      counter++
      if (counter >= (100 + offset)) {
        stream.destroy()
      }
    })
    .on('end', () => t.ok(true, 'Stream ends'))
})

tape('count in buffer mode', t => {
  const max = 100
  const offset = 2147483600
  t.plan(max + 2)
  let counter = offset - 1
  const stream = count.buf({offset})
    .on('data', data => {
      const actual = data.readInt32BE(0)
      t.ok([1, -0xFFFFFFFE].indexOf(actual - counter) >= 0, 'counting ' + data.toString('hex') + ' => ' + actual)
      counter = actual
      if (counter === (max + offset + 0x7fffffff) % 0x80000000 - 0x7fffffff) {
        stream.destroy()
      }
    })
    .on('end', () => t.ok(true, 'Stream ends'))
})
