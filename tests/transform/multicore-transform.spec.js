const bench = require('./multicore-bench')

// Performance - Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz)
//  1x core: 12.162s
//  2x core: 6.150s
//  4x core: 3.683s
//  6x core: 3.746s
//
//  These tests were made with constant total workload.
//  bench() multiplies the workload with the number of cores

const MAX_CORES = Math.min(4, require('os').cpus().length)
for (let n = 0; 2 ** n <= MAX_CORES; n++) {
  bench(2 ** n)
}
