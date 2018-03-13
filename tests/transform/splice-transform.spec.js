const tape = require('tape')
const {range, splice} = require('../../')

tape.skip('[Splice] object stream', t => {
  const every = 5
  const start = 2
  const skip = 1
  const insert = ['foo', 'bar']
  const options = {objectMode: true}
  range(1, 10)
    .pipe(splice(every, start, skip, insert, options))
    .on('data', data => {
      t.ok(data, `object passed ${data}`)
    })
    .on('end', () => t.end('Take object stream should end'))
})
