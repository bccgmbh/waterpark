const tape = require('tape')
const {range, slice} = require('../../')

tape('[Slice] invariant', t => {
  const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  range(0, 9)
    .pipe(slice.obj())
    .on('data', data => {
      t.equal(data, result.shift(), `sliced data passed ${data}`)
    })
    .on('end', () => t.end())
})

tape('[Slice] skip 5', t => {
  const result = [5, 6, 7, 8, 9]
  range(0, 9)
    .pipe(slice.obj({begin: 5}))
    .on('data', data => {
      t.equal(data, result.shift(), `sliced data passed ${data}`)
    })
    .on('end', () => t.end())
})

tape('[Slice] take 3', t => {
  const result = [0, 1, 2]
  range(0, 9)
    .pipe(slice.obj({begin: 0, end: 3}))
    .on('data', data => {
      t.equal(data, result.shift(), `sliced data passed ${data}`)
    })
    .on('end', () => t.end())
})

tape('[Slice] begin 1, end 3, every 5 objects', t => {
  // Index counting from 0
  // Every 5 objects, take only from index 1 to 3 and dismiss the other objects.
  // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  // => 1, 2, 6, 7
  const result = [1, 2, 6, 7]

  range(0, 9)
    .pipe(slice.obj({
      begin: 1,
      end: 3,
      every: 5
    }))
    .on('data', data => {
      t.equal(data, result.shift(), `sliced data passed ${data}`)
    })
    .on('end', () => t.end())
})
