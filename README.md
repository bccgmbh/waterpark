# waterpark
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/bccgmbh/waterpark.svg?branch=master)](https://travis-ci.org/bccgmbh/waterpark)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Stream toolbox library

While working with streams, these basic operations will ease your life.

### Quickstart

    npm i waterpark

In `some-file.js`

```javascript
const {range, skipObjects, reduceObjects, through} = require('waterpark')

range(1, 10)
  .pipe(skipObjects(4))
  .pipe(reduceObjects({}, (sum, val) => sum + val, 0))
  .on('data', console.log)
```

### Supported Streaming Modes

**Object Mode**: stream with `objectMode: true`

**Buffer Mode**: stream with `objectMode: false`

**Types**: R = Readable, T = Transform, W = Writable, D = Duplex

| Name                                          | Type | Object Mode | Buffer Mode |
|:----------------------------------------------|:----:|:-----------:|:-----------:|
| [fromArray](#fromarray-array-options)         | R    | &#10003;    | &#10003;    |
| [fromBuffer](#frombuffer-buffer-options)      | R    | &#8208;     | &#10003;    |
| [interval](#interval-interval-options)        | R    | &#10003;    | &#10003;    |
| [random](#random-size-options)                | R    | &#10003;    | &#10003;    |
| [range](#range-from-to-options)               | R    | &#10003;    | &#8208;     |
| [delay](#delay-milliseconds-jitter-options)   | T    | &#10003;    | &#10003;    |
| [filter](#filter-fn-options)                  | T    | &#10003;    | &#8208;     |
| [multicore](#multicore-path-cores-options)    | T    | &#10003;    | NYI         |
| [splice](#splice)           | T    | &#10003;    | NYI         |
| [skip](#skip)               | T    | &#10003;    | &#10003;    |
| [take](#take)               | T    | &#10003;    | NYI         |
| [through](#through)         | T    | &#10003;    | &#10003;    |
| [drain](#drain)             | W    | &#10003;    | &#10003;    |

## fromArray (array\[, options\])
* `array` <[Array]> source for the readable stream
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting objec mode &#10003; | buffer mode &#10003;

Creates a readable stream form an array.

**Example**

```javascript
const {fromArray} = require('waterpark')

fromArray(['streaming', 'is', 'awesome'])
  .on('data', console.log)
```

Expected output:

    streaming
    is
    awesome


## fromBuffer (buffer\[, options\])
* `buffer` <[Buffer]> source for the readable stream
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting objec mode &#10007; | buffer mode &#10003;

Creates a readable stream form a buffer.

**Example**

```javascript
const {fromBuffer} = require('waterpark')

const buffer = Buffer.from('letters')
fromBuffer(buffer, {highWaterMark: 3})
  .on('data', buf => console.log(buf.toString()))
```

Expected output:

    let
    ter
    s

## interval (interval\[, options\])
* `interval` <[Number]> interval in milliseconds
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10003;

Periodically emits elements.

Internally **interval** is using [setInterval]. So, regarding temporal
precision a jitter as well as drift is to be expected within the order
of milliseconds.

**Example**

```javascript
const {interval} = require('waterpark')

interval(500, {objectMode: true})
  .on('data', console.log)
```

Expected output:

    1520281268331
    1520281269344
    1520281270346
    ...

## random (size\[, options\])
* `size` <[Number]> In object mode: A positive number of random strings.
    In buffer mode: number of random bytes.
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10003;

Emits random strings / buffers with a given size.

**Example**

```javascript
const {random} = require('waterpark')
random(32 * 3, 'hex', {highWaterMark: 32})
  .on('data', console.log)
```

Example output

    c55607c14da303103810c1d0e608f1275e20f7c72d1df4cd9f4b9a4daa48dc39
    f52a5c53a3971c1d43713ce36c81723f09f9ae7f8170dec26545c5b1f8b6b272
    8a9ffdd4f6a90ebae1364bede92fb19b428670af05b3fb184b4b39de582eb7ba


## range (from, to\[, options\])
* `from` <[Number]> integer, included range start.
* `to` <[Number]> integer, included range end.
* `options` <[ReadableOptions]> optional stream options.
* Returns: <[Readable]> supporting object mode &#10003; | buffer mode &#10007;

Emits integers in sequence from the defined range.
`from` may be smaller than `to`, but both must be integer.

**Example**

```javascript
const {range} = require('waterpark')
range(1, 3)
  .on('data', console.log)
```

Expected output:

    1
    2
    3


## delay (milliseconds\[, jitter\]\[, options\])
* `milliseconds` <[Number]> integer, included range start.
* `jitter` <[Number]> integer, included range end.
* `options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10003;

Emits integers in sequence from the defined range.
`from` may be smaller than `to`, but both must be integer.

**Example**

```javascript
const {range, delay} = require('waterpark')
range(1, 3)
  .pipe(delay(500))
  .on('data', console.log)
```

Expected output:

    1
    2
    3

Lines will be printed in sequence. Each one delayed by ~500ms.


## filter (fn\[, options\])
* `fn` <[Function]\(data\) => [Boolean]> pipe data that meets the filter condition.
* `options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10007;

Emits data that passes the `fn` filter condition.
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


## multicore (path, cores\[, options\])
* `path` <[String]> path to module that will be used for clustering.
* `cores` <[Number]> number of cores used in parallel.
* `options` <[TransformOptions]> optional stream options.
* Returns: <[Transform]> supporting object mode &#10003; | buffer mode &#10007;

Stream operations in parallel on multiple cores. &#9733;

Forks the module referenced by `path`, `core` times, spreads the
previous stream data to these child processes and collects their
digests while preserving order.

Communication between the main process and child processes is done via
JSON encoding. Include serialization / deserialization of message sent
to the worker and back into your performance estimation.
If your work is mostly I/O bound you might be looking for
[parallel-transform] which is used in `multicore` as scheduler.

This stream operates in object mode per default.

For optimal performance, use the number of [physical cores](https://nodejs.org/api/os.html#os_os_cpus).
Exceeding that amount is possible on machines with hyper
threading, but if the operation is cpu bound (not I/O bound)
performance will decrease due to thrashing.

**Example**

Let's do some cpu intense calculation and compute the 1e6-fold
SHA256 hash of multiple messages.

`./main.js`
```javascript
const {range, multicore} = require('waterpark')
range(1, 12)
  .pipe(multicore(require.resolve('./worker.js'), 4))
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

## spliceObjects - (options, every, start, deleteCount, ...item)
## spliceBuffers - (options, every, start, deleteCount, buffer)
## skip - (amount, every, options)
## take - (amount, every, options)
## through - (options, fn(data, encoding, cb))
## drainObjects - (options)
## drain - (options)
## console - (options)

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
[parallel-transform]: https://www.npmjs.com/package/parallel-transform