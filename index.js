module.exports = {
  // Reader
  ...require('./src/readable/array-reader'),
  ...require('./src/readable/interval-reader'),
  ...require('./src/readable/random-reader'),
  ...require('./src/readable/range-reader'),

  // Transformer
  ...require('./src/transform/delay-transformer'),
  ...require('./src/transform/multicore-transformer'),
  ...require('./src/transform/reduce-transformer'),
  ...require('./src/transform/skip-transformer'),
  ...require('./src/transform/take-transformer'),
  ...require('./src/transform/through-transformer'),

  // Writer
  ...require('./src/writeable/console-writer'),
  ...require('./src/writeable/null-writer')
}
