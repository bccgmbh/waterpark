const tape = require('tape')
const { range, skip, rollingAvg } = require('../../')

tape('[Rolling] average for last 3 values', t => {
  const results = [5, 7]
  range(1, 10)
    .pipe(skip(1, 2))
    .pipe(rollingAvg(4))
    .on('data', data => {
      t.equal(data, results.shift(), `reduced object ${data} passed`)
    })
    .on('end', () => t.end())
})
