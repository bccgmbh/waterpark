const tape = require('tape')
const {range, skip, fromBuffer} = require('../../')

tape('[Skip] object stream', t => {
  const result = [4, 5]
  t.plan(3) // 3 = (5 - 3) x skip + 1 x END
  range(1, 5)
    .pipe(skip.obj(3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape('[Skip] skip more objects than provided', t => {
  t.plan(1)
  range(1, 3)
    .pipe(skip.obj(10))
    .on('data', data => {
      t.fail('No data should be passed')
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape('[Skip] one every 3rd object', t => {
  const result = [2, 3, 5, 6, 8, 9]
  t.plan(7) // 3 = (5 - 3) x skip + 1 x END
  range(1, 9)
    .pipe(skip.obj(1, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape('[Skip] nothing', t => {
  const result = [1, 2, 3]
  t.plan(4)
  range(1, 3)
    .pipe(skip.obj(0))
    .on('data', data => {
      t.equal(data, result.shift(), `object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape.skip('[Skip] buffer stream', t => {
  t.plan(2)
  fromBuffer(Buffer.from('abcdef'))
    .pipe(skip(3))
    .on('data', data => {
      t.equal(data.toString(), 'def', `3 bytes skipped`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})

tape.skip('[Skip] buffer stream with low water mark', t => {
  const results = ['d', 'ef']
  t.plan(3)
  fromBuffer(Buffer.from('abcdef'), {highWaterMark: 2})
    .pipe(skip(3))
    .on('data', data => {
      t.equal(data.toString(), results.shift(), `3 bytes skipped`)
    })
    .on('end', () => t.ok(true, 'Skip object stream should end'))
})
