const { slice } = require('./slice-transform')

module.exports.take = (amount, every, options = {}) => slice({ end: amount, every, ...options })
module.exports.take.buf = (amount, every, options = {}) => slice.buf({ end: amount, every, ...options })
