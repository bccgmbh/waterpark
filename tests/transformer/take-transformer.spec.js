const tape = require('tape')
const {range, take} = require('../../')

tape('[Take] object stream', t => {
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 5)
    .pipe(take(3))
    .on('data', data => {
      t.ok(data, 'object passed')
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})

tape('[Take] from stream producing the same amount that has been consumed', t => {
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 3)
    .pipe(take(3))
    .on('data', data => {
      t.ok(data, 'object passed')
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})

tape('[Take] Every 3rd object, take one', t => {
  const result = [1, 4, 7] // 3, 6 are missing
  t.plan(4) // 4 = 3 x take + 1 x END
  range(1, 7)
    .pipe(take(1, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Take object stream should end'))
})
