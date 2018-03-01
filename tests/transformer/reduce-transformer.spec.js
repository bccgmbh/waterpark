const tape = require('tape')
const {range, fromBuffer, reduceObjects, reduceBytes} = require('../../')

tape('[Reduce] object stream', t => {
  t.plan(2) // 2 = 1 x reduce + 1 x END
  range(1, 6)
    .pipe(reduceObjects({}, (acc, val) => acc + val))
    .on('data', data => {
      t.equal(data, 21, `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape('[Reduce] segmented object stream', t => {
  const result = [6, 15]
  t.plan(3) // 3 = 2 x reduce + 1 x END
  range(1, 6)
    .pipe(reduceObjects({}, (acc, val) => acc + val, 0, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape('[Reduce] segmented object stream with remainder', t => {
  const result = [1 + 2 + 3, 4 + 5 + 6, 7 + 8]
  t.plan(4) // 3 = 3 x reduce + 1 x END
  range(1, 8)
    .pipe(reduceObjects({}, (acc, val) => acc + val, 0, 3))
    .on('data', data => {
      t.equal(data, result.shift(), `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})

tape.skip('[Reduce] buffer stream', t => {
  t.plan(2) // 2 = 1 x reduce + 1 x END
  fromBuffer(1, 6)
    .pipe(reduceBytes({}, (acc, val) => acc + val))
    .on('data', data => {
      t.equal(data, 21, `reduced object ${data} passed`)
    })
    .on('end', () => t.ok(true, 'Reduce object stream should end'))
})
