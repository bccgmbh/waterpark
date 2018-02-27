const tape = require('tape')
const {random, drain, drainObjects, range} = require('../../')

tape('[NullWriter] consume an object stream', t => {
  t.plan(1)
  range(1, 3)
    .pipe(drainObjects())
    .on('data', data => {
      t.fail('NullWriter should not emit data events')
    })
    .on('finish', () => {
      t.ok(true, 'Emit "finish" event after draining an object stream')
    })
})
tape('[NullWriter] consume a buffer stream', t => {
  t.plan(1)
  random(30)
    .pipe(drain())
    .on('data', data => {
      t.fail('NullWriter should not emit data events')
    })
    .on('finish', () => {
      t.ok(true, 'Emit "finish" event after draining an object stream')
    })
})
