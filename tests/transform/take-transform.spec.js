const tape = require('tape')
const {range, fromBuffer, take} = require('../../')

tape('[Take] object stream', t => {
  const result = [1, 2, 3]
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 5)
    .pipe(take.obj(3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})

tape('[Take] from stream producing the same amount that has been consumed', t => {
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 3)
    .pipe(take.obj(3))
    .on('data', data => {
      t.ok(data, 'object passed')
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})

tape('[Take] one every 3rd object', t => {
  const result = [1, 4, 7] // 3, 6 are missing
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 7)
    .pipe(take.obj(1, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})

tape('[Take] only 5 bytes from finite stream', t => {
  const result = Buffer.from('12345')
  t.plan(2)
  fromBuffer(Buffer.from('123456789'))
    .pipe(take(5))
    .on('data', data => {
      t.ok(data.equals(result), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})
