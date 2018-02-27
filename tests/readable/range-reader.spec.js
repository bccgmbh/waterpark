const tape = require('tape')
const {range} = require('../../')

tape('[RangeReader] Finite range stream (default) emitting numbers', t => {
  const MAX_COUNT = 4
  let count = 1
  t.plan(MAX_COUNT)
  range(2, MAX_COUNT)
    .on('data', data => {
      count++
      t.equal(data, count, 'Range reader should increment its counter')
    })
    .on('end', () => {
      t.ok(true, 'Finite range reader should terminate as expected')
    })
})

tape('[RangeReader] Finite range stream counting backwards', t => {
  const MAX_COUNT = 4
  let count = MAX_COUNT
  t.plan(MAX_COUNT) // DATA: 4, DATA: 3, DATA: 2, END
  range(MAX_COUNT, 2)
    .on('data', data => {
      t.equal(data, count, 'Range reader should decrement its counter')
      count--
    })
    .on('end', () => {
      t.ok(true, 'Finite range reader should terminate as expected')
    })
})

tape('[RangeReader] Range stream with invalid parameters', t => {
  t.plan(2)
  t.throws(() => range('_', 3), 'Throws exception if from parameter is not a number')
  t.throws(() => range(1, true), 'Throws exception if to parameter is not a number')
  // t.end()
})
