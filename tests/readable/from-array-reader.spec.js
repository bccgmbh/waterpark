const tape = require('tape')
const { fromArray } = require('../../')

tape('[ArrayReader] reads elements from array', t => {
  const result = [1, 2, 3]
  const arr = [1, 2, 3]
  t.plan(arr.length + 1)
  fromArray(arr)
    .on('data', data => {
      t.equal(data, result.shift(), `emit element in sequence from array`)
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[ArrayReader] in "buffer mode"', t => {
  const result = [1, 2, 3].map(n => Buffer.from(n.toString(10)))
  const arr = ['1', '2', '3']
  t.plan(arr.length * 2 + 1)
  fromArray.buf(arr)
    .on('data', data => {
      const res = result.shift()
      t.ok(Buffer.isBuffer(res), 'emit buffer') // redundant?
      t.deepEqual(data, res, `emit bytes in sequence from array`)
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[ArrayReader] with empty array', t => {
  const arr = []
  t.plan(1)
  fromArray(arr)
    .on('data', data => {
      t.equal(typeof data, 'number', 'read element from array')
    })
    .on('end', () => {
      t.ok(true, 'stream ends')
    })
})

tape('[ArrayReader] complains for not providing an array', t => {
  t.throws(() => fromArray('not an array'), 'Throws exception if no array has been provided')
  t.throws(() => fromArray(), 'Throws exception if no array has been provided')
  t.end()
})
