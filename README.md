# waterpark
Stream toolbox library

While working with streams, these basic operations will ease your life.

## Quickstart

    npm i waterpark

In `some-file.js`

    const {range, skip, through, console}
    range(1, 10)
      .pipe(skip(3))
      .pipe(through())

## Reader

* fromArray ( array, \[, options\] ) // object stream
* interval ( interval \[, options\] ) // object stream
* random ( size, \[, options\] \[, options\] ) // buffer / object stream
* range ( from, to, \[, options\] ) // object stream

## Transformer
* delay - (milliseconds, jitter, options) // object stream
* delayBuffer - (milliseconds, jitter, options) // buffer stream
* spliceObjects - (options, every, start, deleteCount, ...item) // Not yet implemented!
* spliceBuffers - (options, every, start, deleteCount, buffer) // Not yet implemented!
* skip - (amount, every, options) // object stream
* take - (amount, every, options) // buffer stream
* through - (options, fn(data, encoding, cb)) // buffer / object stream
* multicore - (modulePath, cores, options) // buffer / object stream

## Writer

* drainObjects - (options) // object writer
* drain - (options) // buffer writer
* Console - (options)
