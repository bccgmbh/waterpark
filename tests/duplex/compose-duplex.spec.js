const tape = require('tape')
const {compose, range, through} = require('../../')

tape.skip('[Compose] compose 3 streams', t => {
  t.plan(11)
  const dx = compose(
    through({highWaterMark: 1}, (data, encoding, cb) => {
      console.log('[through1] ', data)
      cb(null, data * 2)
    }).on('end', () => console.log('[through1] END')),
    through((data, encoding, cb) => {
      console.log('[through2] ', data)
      cb(null, data.toString().padStart(8))
    }).on('end', () => console.log('[through2] END')),
    through((data, encoding, cb) => {
      console.log('[through3] ', data)
      cb(null, '+' + data)
    }).on('end', () => console.log('[through3] END')),
    {objectMode: true, highWaterMark: 1}
  )
  range(1, 10)
    .on('end', () => console.log('[RANGE] END'))
    .pipe(dx)
    .on('data', data => {
      t.ok(data, `object passed ${data}`)
    })
    .on('end', () => t.ok(true, 'Through object stream should end'))
    .on('error', (err) => console.error(err))
})

tape.skip('[Compose] compose 2 streams', t => {
  t.plan(11)
  const dx = compose(
    through((data, encoding, cb) => cb(null, data * 2)),
    through((data, encoding, cb) => cb(null, data.toString().padStart(8))),
    {objectMode: true}
  )
  range(1, 10)
    .pipe(dx)
    .on('data', data => t.ok(data, `object passed ${data}`))
    .on('end', () => t.ok(true, 'Through object stream should end'))
})
