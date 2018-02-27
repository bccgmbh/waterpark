const tape = require('tape')
const {range, through, throughBuffer, throughPromise, random} = require('../../')

// const DEFAULT_HIGH_WATERMARK = 16384

tape('[Through] object stream', t => {
  t.plan(4)
  range(1, 3)
    .pipe(through((data, encoding, cb) => {
      cb(null, data * 2)
    }))
    .on('data', data => {
      t.ok(data, 'object passed')
    })
    .on('end', () => t.ok(true, 'Through object stream should end'))
})

tape('[Through] buffer stream', t => {
  t.plan(4)
  const highWatermarkOptions = {highWaterMark: 10}
  // const ENCODING = 'utf8'
  random(30, null, highWatermarkOptions)
  // .on('data', (data:Buffer) => console.log('[TEST:INVARIANT] RandomReader DATA', data))
    .pipe(throughBuffer(highWatermarkOptions, (data, encoding, cb) => {
      cb(null, data)
    }))
    .on('data', data => {
      t.equal(data.length, highWatermarkOptions.highWaterMark, 'Through buffer has correct size')
    })
    .on('end', () => t.ok(true, 'Through buffer stream should end'))
})

tape('[Through] promise stream', t => {
  t.plan(4)
  range(1, 3)
  // .on('data', (data:Buffer) => console.log('[TEST:INVARIANT] RandomReader DATA', data))
    .pipe(throughPromise((data) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data)
        }, 100)
      })
    }))
    .on('data', data => {
      t.equal(typeof data, 'number', 'Promise resolved')
    })
    .on('end', () => t.ok(true, 'Through promise stream should end'))
})
