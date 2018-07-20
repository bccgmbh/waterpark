const tape = require('tape')
const {range, concurrent} = require('../../')

tape('[Concurrent] object stream', t => {
  let result = [1, 2, 3, 4, 5, 6, 7, 8]
  const count = result.length
  t.plan(count + 1)

  range(1, count)
    .pipe(concurrent({
      concurrency: 3,
      transform: (data, encoding, cb) => {
        setTimeout(() => cb(null, data), 200)
      }
    }))
    .on('data', data => {
      t.equal(data, result.shift(), `data is passed concurrently ${data}`)
    })
    .on('end', () => {
      t.equal(result.length, 0, `Concurrent stream should end after ${count}`)
    })
})

tape('[Concurrent] object stream with error', t => {
  let result = [1, 2, 3]
  let count = 0
  t.plan(2)

  range(1, 3)
    .pipe(concurrent({
      concurrency: 1,
      transform: function (data, encoding, cb) {
        setTimeout(() => {
          if (count++ !== 1) {
            cb(null, data)
          } else {
            cb(new Error('foobar'))
          }
        }, 200)
      }
    }))
    .on('data', data => {
      t.equal(data, result.shift(), `data is passed concurrently ${data}`)
    })
    .on('error', err => {
      t.equal(err.message, 'foobar', 'propagates error')
    })
    .on('end', () => {
      t.equal(result.length, 2, `Concurrent stream should end after ${count}`)
    })
})

tape('[Concurrent] synchronous transformation', t => {
  let result = [1, 2, 3, 4, 5]
  t.plan(6)

  range(1, 5)
    .pipe(concurrent({
      concurrency: 2,
      transform: function (data, encoding, cb) {
        cb(null, data)
      }
    }))
    .on('data', data => {
      t.equal(data, result.shift(), `data is passed concurrently ${data}`)
    })
    .on('end', () => {
      t.equal(result.length, 0, `Concurrent stream should end`)
    })
})

tape.only('[Concurrent] async unordered termination', t => {
  let result = [2, 1, 3, 4, 5, 6]
  let count = 0
  t.plan(7)

  const now = Date.now()
  const elapsed = () => (Date.now() - now) / 1000
  range(1, 6)
    .pipe(concurrent({
      concurrency: 2,
      transform: function (data, encoding, cb) {
        const delay = 1000 * (1 + ++count % 2)
        console.log('[Transform] delay %d for %d\t%d', data, delay, elapsed())
        setTimeout(() => cb(null, data), delay)
      }
    }))
    .on('data', data => {
      t.equal(data, result.shift(), `data is passed concurrently ${data}   ___ ${elapsed()}`)
    })
    .on('end', () => {
      t.equal(result.length, 0, `Concurrent stream should end`)
    })
})
