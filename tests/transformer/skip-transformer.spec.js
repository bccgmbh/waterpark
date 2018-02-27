const tape = require('tape')
const {range, skipObjects} = require('../../')

tape('[Skip] object stream', t => {
  const result = [4, 5]
  t.plan(3) // 3 = (5 - 3) x skip + 1 x END
  range(1, 5)
    .pipe(skipObjects(3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape('[Skip] skip more objects than provided', t => {
  t.plan(1)
  range(1, 3)
    .pipe(skipObjects(10))
    .on('data', data => {
      t.fail('No data should be passed')
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape('[Skip] nothing', t => {
  const result = [1, 2, 3]
  t.plan(4)
  range(1, 3)
    .pipe(skipObjects(0))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})
