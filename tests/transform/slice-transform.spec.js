const tape = require('tape')
const {range, random, slice} = require('../../')
const {PassThrough} = require('stream')

tape('[Slice] invariant objects', t => {
  const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  checkResults(range(0, 9).pipe(slice.obj()), t, result)
})

tape('[Slice] skip 5 objects', t => {
  const result = [5, 6, 7, 8, 9]
  range(0, 9)
    .pipe(slice.obj({begin: 5}))
    .on('data', data => {
      t.equal(data, result.shift(), `sliced data passed ${data}`)
    })
    .on('end', () => t.end())
})

tape('[Slice] take 3 objects', t => {
  const result = [0, 1, 2]
  range(0, 9)
    .pipe(slice.obj({end: 3}))
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

// --- buffer mode ---

tape('Slice invariant bytes', t => {
  deepCheckScenarios(t, {}, [{
    name: 'single buffer',
    provided: ['0123456789'],
    expected: ['0123456789']
  }])
})

tape('Slice', t => {
  deepCheckScenarios(t, {begin: 3}, [{
    name: 'skip 3 bytes form single buffer',
    provided: ['0123456789'],
    expected: ['3456789']
  }, {
    name: 'skip 3 bytes from fragmented buffer',
    provided: ['0123', '4567', '89'],
    expected: ['3', '4567', '89']
  }])
})

tape('[Slice] take 3 bytes', t => {
  deepCheckScenarios(t, {end: 3}, [{
    name: 'single buffer',
    provided: ['0123456789'],
    expected: ['012']
  }, {
    name: 'multiple buffer',
    provided: ['0', '123', '4567', '89'],
    expected: ['0', '12']
  }])
})

tape('[Slice] skip 5 bytes then take 2 bytes', t => {
  deepCheckScenarios(t, {begin: 3, end: 5}, [{
    name: 'single buffer',
    provided: ['0123456789'],
    expected: ['34']
  }, {
    name: 'multiple buffer',
    provided: ['0', '123', '4567', '89'],
    expected: ['3', '4']
  }])
})

tape('[Slice] skip 2 bytes every 5 bytes', t => {
  deepCheckScenarios(t, {begin: 2, end: 4, every: 5}, [{
    name: 'single buffer',
    provided: ['0123456789'],
    expected: ['23', '78']
  }, {
    name: 'multiple buffer',
    provided: ['0', '12', '3456789'],
    expected: ['2', '3', '78']
  }])
})

tape('[Slice] slice finite sequence from continuous stream', t => {
  t.plan(6)
  random.buf({highWaterMark: 4}) // emits buffers of length 4
    .pipe(slice({begin: 2, end: 18}))
    .on('data', data => t.ok(Buffer.isBuffer(data), 'emits buffer'))
    .on('end', () => t.pass('Stream ends after slice'))
})

function deepCheckScenarios (t, options, scenarios) {
  scenarios.forEach((scenario, sIndex) => {
    scenario.provided = scenario.provided.map(Buffer.from).concat(null)
    scenario.expected = scenario.expected.map(Buffer.from)
    t.test(scenario.name, st => {
      const reader = new PassThrough()
      const stream = reader.pipe(slice(options))
      deepCheckResults(stream, st, scenario.expected)
      scenario.provided.map(buffer => reader.push(buffer))
    })
  })
}

function checkResults (stream, t, results) {
  stream
    .on('data', data => {
      t.equal(data, results.shift(), `data passed ${data}`)
    })
    .on('end', () => t.end())
}

function deepCheckResults (stream, t, results) {
  t.plan(results.length + 1)
  stream
    .on('data', data => {
      t.deepEqual(data, results.shift(), `data passed ${data}`)
    })
    .on('end', () => t.ok(true, 'stream ends'))
}
