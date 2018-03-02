const {Transform} = require('stream')

/**
 * Like Array.reduce() but for object streams
 * @param options {object} TransformOptions
 * @param fn {Function(accumulator, currentValue, currentIndex)} reduce function
 * @param initialValue {*} Will be passed to fn as initial value for accumulator. Default: 0
 * @param repeatAfter {Number} Use, if it's desired to reduce segments of a stream and pipe these results.
 * When repeatAfter is used, be aware that finite streams will also push the accumulator on "end".
 * If the total amount of objects is not a natural multiple of repeatAfter, the last result might behave unexpected.
 * @return {*}
 */
module.exports.reduceObjects = (options = {}, fn, initialValue = 0, repeatAfter = Number.POSITIVE_INFINITY) => {
  if (repeatAfter !== Number.POSITIVE_INFINITY &&
    (repeatAfter <= 0 || !Number.isInteger(repeatAfter))) {
    throw new Error('"repeatAfter" must be a Number')
  }
  let index = 0
  let accumulator = initialValue
  return new Transform(
    {
      objectMode: true,
      transform: (data, encoding, cb) => {
        if (index < repeatAfter - 1) {
          // console.log(`[Transform] fn(${accumulator}, ${data}, ${index})`)
          accumulator = fn(accumulator, data, index)
          index++
          return cb()
        }
        // console.log(`[Transform] fn(${accumulator}, ${data}, ${index})`)
        const result = fn(accumulator, data, index)
        accumulator = initialValue
        index = 0
        cb(null, result)
      },
      flush (cb) {
        if (index !== 0) {
          // console.log('[Flush] ', index)
          this.push(accumulator)
        }
        cb()
      },
      ...options
    }
  )
}

/**
 * Like Array.reduce() but for buffer streams
 * @param options {object} TransformOptions
 * @param fn {Function(accumulator, currentValue, currentIndex)} reduce function
 * @param initialValue {*} Will be passed to fn as initial value for accumulator. Default: EmptyBuffer
 * @param repeatAfter {Number} Use, if it's desired to reduce segments of a stream and pipe these results.
 * When repeatAfter is used, be aware that finite streams will also push the accumulator on "end".
 * If the total amount of objects is not a natural multiple of repeatAfter, the last result might behave unexpected.
 * @return {*}
 */
module.exports.reduceBytes = (options = {}, fn, initialValue = 0, repeatAfter = Number.POSITIVE_INFINITY) => {
  if (repeatAfter !== Number.POSITIVE_INFINITY &&
    (repeatAfter <= 0 || !Number.isInteger(repeatAfter))) {
    throw new Error('"repeatAfter" must be a Number')
  }
  let index = 0
  let accumulator = initialValue
  return new Transform(
    {
      objectMode: false,
      transform: (data, encoding, cb) => {
        if (index < repeatAfter - 1) {
          // console.log(`[Transform] fn(${accumulator}, ${data}, ${index})`)
          accumulator = fn(accumulator, data, index)
          index++
          return cb()
        }
        // console.log(`[Transform] fn(${accumulator}, ${data}, ${index})`)
        const result = fn(accumulator, data, index)
        accumulator = initialValue
        index = 0
        cb(null, result)
      },
      flush (cb) {
        if (index !== 0) {
          // console.log('[Flush] ', index)
          this.push(accumulator)
        }
        cb()
      },
      ...options
    }
  )
}
