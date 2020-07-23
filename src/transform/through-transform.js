const { Transform } = require('stream')

function through (options, callback) {
  [options, callback] = normalizeCallSignature(options, callback)
  options.transform = callback
  options.objectMode = true
  return new Transform(options)
}

through.buf = (options, callback) => {
  [options, callback] = normalizeCallSignature(options, callback)
  options.transform = callback
  return new Transform(options)
}

through.sync = (options, callback) => {
  [options, callback] = normalizeCallSignature(options, callback)
  options.transform = (data, enc, next) => next(null, callback(data))
  return new Transform(options)
}

/**
 * Make sure that options.readableObjectMode is compatible with promiseFactory call signature
 * Make sure that options.writableObjectMode is compatible with promise outcome (both resolve and fail)
 *
 * @param options
 * @param promiseFactory { function(chunk, encoding): Promise<any> }
 */
through.promise = (options, promiseFactory) => {
  [options, promiseFactory] = normalizeCallSignature(options, promiseFactory)
  options.objectMode = true
  options.transform = (chunk, encoding, cb) => {
    callbackify((promiseFactory)(chunk, encoding), cb)
  }
  return new Transform(options)
}

/**
 * Since options as first argument is optional, possibly shifting callback as first argument,
 * this method ensures that callback is the callback and options are the options.
 */
function normalizeCallSignature (options, callback) {
  if (typeof callback === 'function') {
    return [options, callback]
  } else if (typeof options === 'function') {
    return [{}, options]
  } else {
    throw new Error('through(options, cb) requires a callback function as argument!')
  }
}

function callbackify (promise, cb) {
  promise.then(res => cb(null, res)).catch(err => cb(err))
}

module.exports = {
  through
}
