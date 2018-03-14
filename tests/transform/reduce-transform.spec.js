const tape = require('tape')
const {range, fromBuffer, reduce} = require('../../')

tape('[Reduce] object stream', t => {
  t.plan(2) // 2 = 1 x reduce + 1 x END
  range(1, 6)
    .pipe(reduce.obj({}, (acc, val) => acc + val))
    .on('data', data => {
      t.equal(data, 21, `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape('[Reduce] segmented object stream', t => {
  const result = [6, 15]
  t.plan(3) // 3 = 2 x reduce + 1 x END
  range(1, 6)
    .pipe(reduce.obj({}, (acc, val) => acc + val, 0, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape('[Reduce] segmented object stream with remainder', t => {
  const result = [1 + 2 + 3, 4 + 5 + 6, 7 + 8]
  t.plan(4) // 3 = 3 x reduce + 1 x END
  range(1, 8)
    .pipe(reduce.obj({}, (acc, val) => acc + val, 0, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape.skip('[Reduce] buffer stream', t => {
  t.plan(2) // 2 = 1 x reduce + 1 x END
  fromBuffer(Buffer.from('123456'))
    .pipe(reduce({}, (acc, val) => acc + val))
    .on('data', data => {
      t.equal(data, 21, `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})
