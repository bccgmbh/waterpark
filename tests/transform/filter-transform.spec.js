const tape = require('tape')
const {range, filter} = require('../../')

tape('[Filter] object stream', t => {
  let result = [1, 3, 5]
  t.plan(4)

  range(1, 5)
    .pipe(filter(n => n % 2)) // filter odd numbers
    .on('data', data => {
      t.equal(data, result.shift(), `filtered odd numbers ${data}`)
    })
    .on('end', () => t.ok(true, 'Filter stream should end'))
})
