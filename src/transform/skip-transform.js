const { slice } = require('./slice-transform')

module.exports.skip = (amount, every, options = {}) => slice({ begin: amount, every, ...options })
module.exports.skip.buf = (amount, every, options = {}) => slice.buf({ begin: amount, every, ...options })
