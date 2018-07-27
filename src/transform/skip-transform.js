const {slice} = require('./slice-transform')

module.exports.skip = (amount, every, options = {}) => slice({begin: amount, every, ...options})
module.exports.skip.obj = (amount, every, options = {}) => slice.obj({begin: amount, every, ...options})
