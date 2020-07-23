# waterpark
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/bccgmbh/waterpark.svg?branch=master)](https://travis-ci.org/bccgmbh/waterpark)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Stream toolbox library

While working with streams, these basic operations will ease your life.

### Quickstart

    npm i waterpark

```javascript
const {range, take, reduce} = require('waterpark')

// sum even numbers from 0 to 100
range(0, 100)
  .pipe(take.obj({amount: 1, every: 2}))
  .pipe(reduce.obj((sum, val) => sum + val, 0))
  .on('data', console.log)
```


### Supported Streaming Modes

**Object Mode**: stream with `objectMode: true`

**Buffer Mode**: stream with `objectMode: false`

Waterpark streams default to objectMode (exception: `fromBuffer`).

**Types**: R = Readable, T = Transform, W = Writable, D = Duplex

| Name                               | Type | Object Mode | Buffer Mode | Shorthand
|:-----------------------------------|:----:|:-----------:|:-----------:|:----------
| [concurrent](#concurrent-options)  | T    | &#10003;    | &#10003;    | concurrent (concurrency, transformHandler, options)
| [count](#count-options)            | R    | &#10003;    | &#10003;    | count (offset, options)
| [delay](#delay-options)            | T    | &#10003;    | &#10003;    | delay (milliseconds, jitter, options)
| [filter](#filter-options)          | T    | &#10003;    | &#10003;    | filter (filterHandler, options)
| [fromArray](#fromarray-options)    | R    | &#10003;    | &#10003;    | fromArray (array, options)
| [fromBuffer](#frombuffer-options)  | R    | &#10003;    | &#10003;    | fromBuffer (buffer, options)
| [interval](#interval-options)      | R    | &#10003;    | &#8208;     | interval (milliseconds, options)
| [multicore](#multicore-options)    | T    | &#10003;    | &#10003;    | multicore (cores, path, options)
| [random](#random-options)          | R    | &#10003;    | &#10003;    | random (size, options)
| [range](#range-options)            | R    | &#10003;    | &#10003;    | range (from, to, options)
| [reduce](#reduce-options)          | R    | &#10003;    | &#8208;     | reduce (reducer, initialValue, repeatAfter)
| [slice](#slice-options)            | T    | &#10003;    | &#10003;    | slice (begin, end, every, options)
| [skip](#skip-options)              | T    | &#10003;    | &#10003;    | skip (begin, every, options)
| [take](#take-options)              | T    | &#10003;    | &#10003;    | take (amount, every, options)
| [through](#through-options)        | T    | &#10003;    | &#10003;    | through (fn, options)

## count (options)
* `offset` <number> (default = 0) offset will be the first number emitted.
* ...`options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]>

Creates a readable stream emitting incrementing numbers.

**Example**

```javascript
const {count} = require('waterpark')
count().on('data', console.log)
```

Expected output:

    0
    1
    2
    ...

## fromArray (options)
* `array` <[Array]> source for the readable stream
* ...`options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10003;

Creates a readable stream form an array.

**Example**

```javascript
const {fromArray} = require('waterpark')

const array = ['streaming', 'is', 'awesome']
fromArray({array})
  .on('data', console.log)
```

Expected output:

    streaming
    is
    awesome


## fromBuffer (options)
* `buffer` <[Buffer]> source for the readable stream
* ...`options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10007; | buffer mode &#10003;

Creates a readable stream form a buffer.

**Example**

```javascript
const {fromBuffer} = require('waterpark')

const buffer = Buffer.from('letters')
fromBuffer({buffer, highWaterMark: 3})
  .on('data', buf => console.log(buf.toString()))
```

Expected output:

    let
    ter
    s

## interval (options)
* `interval` <[Number]> interval in milliseconds
* ...`options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10007;

Periodically emits the current unix timestamp.

Internally **interval** is using [setInterval]. Temporal jitter as
well as drift within the order of milliseconds might occur.

**Example**

```javascript
const {interval} = require('waterpark')

interval({interval: 500, objectMode: true})
  .on('data', console.log)
```

Expected output:

    1520281268331
    1520281269344
    1520281270346
    ...

## random (options)
* `size` <[Number]> length of emitted strings.
* ...`options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10003;

Emits random hex-encoded strings / buffers with a given size.

**Example**

```javascript
const {random} = require('waterpark')
random.obj({
    size: 32 * 3,
    encoding: 'hex',
    highWaterMark: 32
  })
  .on('data', console.log)
```

Example output

    c55607c14da303103810c1d0e608f1275e20f7c72d1df4cd9f4b9a4daa48dc39
    f52a5c53a3971c1d43713ce36c81723f09f9ae7f8170dec26545c5b1f8b6b272
    8a9ffdd4f6a90ebae1364bede92fb19b428670af05b3fb184b4b39de582eb7ba


## range (options)
* `from` <[Number]> integer, included range start.
* `to` <[Number]> integer, included range end.
* ...`options` <[ReadableOptions]> optional stream options.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10007;

Emits integers in sequence from the defined range.
`from` may be smaller than `to`, but both must be integer.

**Example**

```javascript
const {range} = require('waterpark')

range({from: 1, to: 3})
  .on('data', console.log)
```

Expected output:

    1
    2
    3


## concurrent (options)
* `concurrency` <[Number]> integer, concurrent transform operations.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

Concurrent stream processing.

**Example**

```javascript
const {range, concurrent} = require('waterpark')
range({from: 1, to: 100})
  .pipe(concurrent({
    concurrency: 10,
    transform: (data, encoding, cb) => {
      setTimeout(() => cb(null, data), 100)
    }
   }))
  .on('data', console.log)
```

Finishes in ~1s while `through` would take ~10s

## delay (options)
* `milliseconds` <[Number]> integer, included range start.
* `jitter` <[Number]> integer, included range end.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

Emits data delayed by a specified amount of time.

**Example**

```javascript
const {range, delay} = require('waterpark')
range({from: 1, to: 3})
  .pipe(delay({delay: 500}))
  .on('data', console.log)
```

Expected output:

    1
    2
    3

Lines will be printed in sequence. Each one delayed by ~500ms.


## filter (options)
* `filter` <[Function]\(data\) => [Boolean]> pipe data that meets the filter condition.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10007;

Emits data that passes the `filter` filter condition.
This stream operates in object mode per default.

**Example**

```javascript
const {range, filter} = require('waterpark')
range(1, 5)
  .pipe(filter(n => n % 2))
  .on('data', console.log)
```

Expected output:

    1
    3
    5

The inital range 1 to 5 is filtered for odd numbers


## multicore (options)
* `path` <[String]> path to module that will be used for clustering.
* `cores` <[Number]> number of cores used in parallel.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

Stream operations in parallel on multiple cores. &#9733;

Forks the module referenced by `path`, `core` times, spreads the
previous stream data to these child processes, computes their transform
handlers in parallel and collects their digests while preserving order.

Communication between the main process and child processes is done via
JSON encoding. Include serialization and deserialization of data that
needs to be communicated to the worker and back into your performance 
estimation.
If your work is mostly I/O bound you might be looking for
[concurrent](#concurrent-options) which is used in `multicore` as scheduler.

For optimal performance, use the number of [physical cores](https://nodejs.org/api/os.html#os_os_cpus).
Exceeding that amount is possible on machines with hyper
threading, yet might yield actually less performance due to thrashing.

**Example**

Let's do some cpu intense calculation and compute the 1e6-fold
SHA256 hash of multiple messages.

`./main.js`
```javascript
const {range, multicore} = require('waterpark')
range(1, 12)
  .pipe(multicore(4, require.resolve('./worker.js')))
  .on('data', console.log)
```

`./worker.js`
```javascript
const {createHash} = require('crypto')

process.on('message', (msg) => {
  for (let i = 1e6; i > 0; i--) {
    msg = createHash('sha256').update(msg.toString()).digest('hex')
  }
  process.send(msg)
})
```

Then execute `node main`

Expected output:

    d6c3110abae572a3ce11a696068dca0f01961fbbf9f2c08bdfdde3640b79db0b
    3a2ae473ab4a5fc533adb7367af8b1ffdd5a5a78fafb51945a0869021b07bb14
    945a76e4ef3a32651ffde16b90d26c24bbadc9bdf50ff5f580f869108d6bff86
    60ca5d721a66d84bfcfab6e0b79a8f5e83bb7a7cd24dcf11dcf4b8a348cf5fe8
    ...

Each line represents the outcome of a CPU intense calculation.
`range` runs on the main process and sequentially pipes numbers 
into 4 child process each running on a separate core which are 
therefore able to calculate the expensive hash function in parallel.

## slice (options)
* `begin` <[Number]> zero based index at which to begin extraction.
Default is 0
* `end` <[Number]> pass elements up to but not including (zero based index).
* `every` <[Number]> repeat slice operation after `every` elements.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

Similar to
[Array.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
and [Buffer.slice()](https://nodejs.org/api/buffer.html#buffer_buf_slice_start_end)
**slice** is acting as range filter on its source.

In respect to streams potential infinite nature, the `every` parameter
has been introduced.

**Example**
Every 5 elements, pass the 2nd to the 4th element.
```javascript
const {range, slice} = require('waterpark')
range(0, 9)
  .pipe(slice.obj(1, 4, 5))
  .on('data', console.log)
```

Expected output:

    1
    2
    3
    6
    7
    8

See: [skip](#skip-amount-every-options), [take](#take-amount-every-options)

## reduce (reducer\[, initalValue\]\[, every\])
* `options` <[TransformOptions]> optional stream options.
* `reducer` <Function (accumulator, currentValue, currentIndex)>
  * `accumulator` <[any]> accumulates the callbacks return values.
  * `currentValue` <[any]> the current element being processed.
  * `currentIndex` <[Number]> zero based index of the current element.
* `initialValue` <[any]> Initial accumulator value. Default is 0
* `every` <[Number]> repeat reduction after `every` steps.
Default is infinity which reduces only once at the end of the source.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10007;

Reduces stream emissions to one (source stream must be finite) or many
if `every` is set.

**Example**
Every 4 numbers emit the sum of the last 4 numbers.
```javascript
const {range, reduce} = require('waterpark')

range.obj(1, 100)
  .pipe(reduce.obj((sum, val) => sum + val, 0, 4))
  .on('data', console.log)
```

Expected output:

    10
    26
    42
    58
    74
    ...


## skip (amount\[, every\]\[, options\])
* `amount` <[Number]> skip this amount of objects / bytes.
Default is 0
* `every` <[Number]> repeat skip operation after `every` elements.
Default is infinity. `every` must be bigger than `amount`.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

See also: [slice](#slice-options)

In respect to streams potential infinite nature, the `every` parameter
has been introduced.

**Example**
Every 5 elements, pass the 2nd to the 4th element.
```javascript
const {range, slice} = require('waterpark')
range(0, 9)
  .pipe(slice(1, 4, 5))
  .on('data', console.log)
```

Expected output:

    1
    2
    3
    6
    7
    8

## take (amount\[, every\]\[, options\])
* `amount` <[Number]> only take this amount of objects / bytes.
Default is 0
* `every` <[Number]> repeat take operation after `every` elements.
Default is infinity, which will cause take to end after `amount` elements
have been processed.
* ...`options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

In respect to streams potential infinite nature, the `every` parameter
has been introduced.

See also: [slice](#slice-options)

**Example**
Take first 3 elements of a stream.
```javascript
const {count, take} = require('waterpark')
count()
  .pipe(take(3))
  .on('data', console.log)
```

Expected output:

    0
    1
    2

## through (\[options, \]fn(data, encoding, cb))
* `options` <[TransformOptions]> optional stream options.
* `fn` <[Function]> transform function
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

A quick way to define a transform stream.

**Example (synchronous transformation)**
```js
const {through, range} = require('waterpark')
range(1, 3)
  .pipe(through.sync(x => x * 2))
  .on('data', console.log)
```

Expected output:

    2
    4
    6

**Example (async transformation)**
```js
const {through, range} = require('waterpark')
range(1, 3)
  .pipe(through((data, encoding, cb) => {
    doSomethingAsync(data, cb)
  }))
  .on('data', console.log)
```

**Example (promise transformation)**
```js
const {through, range} = require('waterpark')
range(1, 3)
  .pipe(through.promise(myPromiseFactory)
  .on('data', console.log)
```


[any]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Buffer]: https://nodejs.org/api/buffer.html#buffer_buffer

[Readable]: https://nodejs.org/api/stream.html#stream_readable_streams
[ReadableOptions]: https://nodejs.org/api/stream.html#stream_new_stream_readable_options
[Transform]: https://nodejs.org/api/stream.html#stream_class_stream_transform
[TransformOptions]: https://nodejs.org/api/stream.html#stream_new_stream_transform_options
[Writable]: https://nodejs.org/api/stream.html#stream_class_stream_writable
[WritableOptions]: https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options
[Duplex]: https://nodejs.org/api/stream.html#stream_class_stream_duplex
[DuplexOptions]: https://nodejs.org/api/stream.html#stream_new_stream_duplex_options

[setInterval]: https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args