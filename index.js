module.exports = {
  // Reader
  ...require('./src/readable/array-reader'),
  ...require('./src/readable/buffer-reader'),
  ...require('./src/readable/interval-reader'),
  ...require('./src/readable/random-reader'),
  ...require('./src/readable/range-reader'),

  // Transformer
  ...require('./src/transform/delay-transform'),
  ...require('./src/transform/multicore-transform'),
  ...require('./src/transform/reduce-transform'),
  ...require('./src/transform/skip-transform'),
  ...require('./src/transform/take-transform'),
  ...require('./src/transform/through-transform'),

  // Writer
  ...require('./src/writable/console-writer'),
  ...require('./src/writable/null-writer')
}
