# waterpark
Stream toolbox library

While working with streams, these basic operations will ease your life.

## Quickstart

    npm i waterpark

In `some-file.js`

    const {range, skipObjects, reduceObjects, through} = require('waterpark')
    
    range(1, 10)
      .pipe(skipObjects(4))
      .pipe(reduceObjects({}, (sum, val) => sum + val, 0))
      .pipe(through((data, encoding, cb) => {
        console.log(data)
        cb()
      }))

## Supported Streaming Modes

**Object Mode**: stream with `objectMode: true`

**Buffer Mode**: stream with `objectMode: false`

**Types**: R = Readable, T = Transform, W = Writable, D = Duplex

| Name                        | Type | Object Mode | Buffer Mode |
|:----------------------------|:----:|:-----------:|:-----------:|
| [fromArray](#fromarray-array-options)     | R    | &#10003;    | &#8208;     |
| [fromBuffer](#frombuffer)   | R    | &#10003;    | &#8208;     |
| [interval](#interval)       | R    | &#10003;    | &#8208;     |
| [random](#random)           | R    | &#10003;    | &#10003;    |
| [range](#range)             | R    | &#10003;    | &#8208;     |
| [delay](#delay)             | T    | &#10003;    | &#10003;    |
| [filter](#filter)           | T    | NYI         | NYI         |
| [splice](#splice)           | T    | &#10003;    | NYI         |
| [skip](#skip)               | T    | &#10003;    | &#10003;    |
| [take](#take)               | T    | &#10003;    | NYI         |
| [through](#through)         | T    | &#10003;    | &#10003;    |
| [multicore](#multicore)     | T    | &#10003;    | NYI         |
| [drain](#drain)             | W    | &#10003;    | &#10003;    |

## Readable

### fromArray (array \[, options\])
* array {Array} source for the readable stream
* options {Object} \<optional\> ReadableOptions

creates a readable object stream form an array.


**Example**

    const {fromArray} = require('waterpark')
    fromArray([1, 2, 3])

### interval ( interval \[, options\] )
* interval {Integer} interval in milliseconds
* options {Object} \<optional\> ReadableOptions

Periodically emits elements.

**Example**

    const {interval} = require('waterpark')
    interval(100).pipe(process.stdout)


### random ( size, \[, options\] )
* size {Integer} In object mode: number of random strings.
    In buffer mode: number of random bytes.
* options {Object} \<optional\> ReadableOptions


### range

    range ( from, to, \[, options\] ) // object stream


## Transform
* delay - (milliseconds, jitter, options) // object stream
* delayBuffer - (milliseconds, jitter, options) // buffer stream
* filter - (options, fn) // buffer / object stream
* spliceObjects - (options, every, start, deleteCount, ...item) // Not yet implemented!
* spliceBuffers - (options, every, start, deleteCount, buffer) // Not yet implemented!
* skip - (amount, every, options) // object stream
* take - (amount, every, options) // buffer stream
* through - (options, fn(data, encoding, cb)) // buffer / object stream
* multicore - (modulePath, cores, options) // buffer / object stream

## Writable

* drainObjects - (options) // object writer
* drain - (options) // buffer writer
* console - (options)

