const tape = require('tape')
const {range, concurrent, pause} = require('../../')

tape.only('[Concurrent] stream-pauses', t => {
  t.plan(51)

  const stream = concurrent({
    concurrency: 7,
    transform: (data, encoding, cb) => {
      setTimeout(() => cb(null, data), 20)
      // cb(null, data)
    }
  })

  let counter = 1
  range(1, 50)
    .pipe(stream)
    .pipe(pause.obj({interval: 10, duration: 1000, target: stream}))
    .on('data', data => t.equal(data, counter, 'data arrived ' + counter++))
    .on('end', () => t.pass('end'))
    .on('error', err => t.fail(err))
})

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
  t.plan(3)

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
      t.equal(result.length, 2, `Concurrent stream should end on ${count}`)
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

tape('[Concurrent] schuffeled results', t => {
  // TIME   |  0  |  1  |  2  |  3  |  4  |  5  |
  // -------+-----+-----+-----+-----+-----+------
  // PUSH   | a:2 | c:4 | d:1 | e:1 |     |     |
  //        | b:1 |     |     |     |     |     |
  // -------+-----+-----+-----+-----+-----+------
  // RESULT |     |  b  |  a  |  d  |  e  |  c  |

  let schedule = [
    {data: 'a', delay: 2},
    {data: 'b', delay: 1},
    {data: 'c', delay: 4},
    {data: 'd', delay: 1},
    {data: 'e', delay: 1}
  ]
  const result = 'badec'.split('')
  t.plan(6)

  range(0, 4)
    .pipe(concurrent({
      concurrency: 2,
      transform: function (index, encoding, cb) {
        const {data, delay} = schedule[index]
        setTimeout(() => cb(null, data), delay * 100)
      }
    }))
    .on('data', actual => {
      const expected = result.shift()
      t.equal(actual, expected, `data is passed concurrently ${actual}`)
    })
    .on('end', () => {
      t.equal(result.length, 0, `Concurrent stream should end`)
    })
})
