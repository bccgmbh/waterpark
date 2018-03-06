[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/bccgmbh/waterpark.svg?branch=master)](https://travis-ci.org/bccgmbh/waterpark)

# waterpark
Stream toolbox library

While working with streams, these basic operations will ease your life.

### Quickstart

    npm i waterpark

In `some-file.js`

    const {range, skipObjects, reduceObjects, through} = require('waterpark')
    
    range(1, 10)
      .pipe(skipObjects(4))
      .pipe(reduceObjects({}, (sum, val) => sum + val, 0))
      .on('data', console.log)

### Supported Streaming Modes

**Object Mode**: stream with `objectMode: true`

**Buffer Mode**: stream with `objectMode: false`

**Types**: R = Readable, T = Transform, W = Writable, D = Duplex

| Name                                          | Type | Object Mode | Buffer Mode |
|:----------------------------------------------|:----:|:-----------:|:-----------:|
| [fromArray](#fromarray-array-options)         | R    | &#10003;    | &#10003;    |
| [fromBuffer](#frombuffer-buffer-options)      | R    | &#8208;     | &#10003;    |
| [interval](#interval-interval-options)        | R    | &#10003;    | &#8208;     |
| [random](#random-size-options)                | R    | &#10003;    | &#10003;    |
| [range](#range-from-to-options)               | R    | &#10003;    | &#8208;     |
| [delay](#delay-milliseconds-jitter-options)   | T    | &#10003;    | &#10003;    |
| [filter](#filter)           | T    | NYI         | NYI         |
| [splice](#splice)           | T    | &#10003;    | NYI         |
| [skip](#skip)               | T    | &#10003;    | &#10003;    |
| [take](#take)               | T    | &#10003;    | NYI         |
| [through](#through)         | T    | &#10003;    | &#10003;    |
| [multicore](#multicore)     | T    | &#10003;    | NYI         |
| [drain](#drain)             | W    | &#10003;    | &#10003;    |

## fromArray (array\[, options\])
* `array` <[Array]> source for the readable stream
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> compatible with object abd buffer mode.

Creates a readable stream form an array.

**Example**

    const {fromArray} = require('waterpark')

    fromArray(['streaming', 'is', 'awesome'])
      .on('data', console.log)

Expected output:

    streaming
    is
    awesome


## fromBuffer (buffer\[, options\])
* `buffer` <[Buffer]> source for the readable stream
* `options` <[ReadableOptions]> options for a readable stream.

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
* Returns: <[Readable]> operating in **object mode!**

Periodically emits elements.

Internally **interval** is using [setInterval]. So, regarding temporal
precision a jitter as well as drift is to be expected within the order
of milliseconds.

**Example**

    const {interval} = require('waterpark')

    interval(1000)
      .on('data', b => {
        console.log(parseInt(b.toString()))
      })

Expected output:

    1520281268331
    1520281269344
    1520281270346
    ...

## random (size\[, options\])
* `size` <[Number]> In object mode: A positive number of random strings.
    In buffer mode: number of random bytes.
* `options` <[ReadableOptions]> options for a readable stream.
* Returns: <[Readable]> compatible with object abd buffer mode.

Emits random strings / buffers with a given size.

**Example**

    const {random} = require('waterpark')
    random(32 * 3, 'hex', {highWaterMark: 32})
      .on('data', console.log)

Example output

    c55607c14da303103810c1d0e608f1275e20f7c72d1df4cd9f4b9a4daa48dc39
    f52a5c53a3971c1d43713ce36c81723f09f9ae7f8170dec26545c5b1f8b6b272
    8a9ffdd4f6a90ebae1364bede92fb19b428670af05b3fb184b4b39de582eb7ba


## range (from, to\[, options\])
* `from` <[Number]> integer, included range start.
* `to` <[Number]> integer, included range end.
* `options` <[ReadableOptions]> optional stream options.
* Returns: <[Readable]> operating in **object mode!**

Emits integers in sequence from the defined range.
`from` may be smaller than `to`, but both must be integer.

**Example**

    const {range} = require('waterpark')
    range(1, 3).on('data', console.log)

Expected output:

    1
    2
    3


## delay (milliseconds\[, jitter\]\[, options\])
* `milliseconds` <[Number]> integer, included range start.
* `jitter` <[Number]> integer, included range end.
* `options` <[ReadableOptions]> optional stream options.
* Returns: <[Readable]> compatible with object abd buffer mode.

Emits integers in sequence from the defined range.
`from` may be smaller than `to`, but both must be integer.

**Example**

    const {range} = require('waterpark')
    range(1, 3).on('data', console.log)

Expected output:

    1
    2
    3



## delayBuffer - (milliseconds, jitter, options)

## filter - (options, fn)
## spliceObjects - (options, every, start, deleteCount, ...item)
## spliceBuffers - (options, every, start, deleteCount, buffer)
## skip - (amount, every, options)
## take - (amount, every, options)
## through - (options, fn(data, encoding, cb))
## multicore - (modulePath, cores, options)
## drainObjects - (options)
## drain - (options)
## console - (options)

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Buffer]: https://nodejs.org/api/buffer.html#buffer_buffer
[ReadableOptions]: https://nodejs.org/api/stream.html#stream_new_stream_readable_options
[Readable]: https://nodejs.org/api/stream.html#stream_readable_streams

[setInterval]: https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args
