const {slice} = require('./slice-transform')
module.exports.take = (amount, every, options = {}) => slice({end: amount, every, ...options})
module.exports.take.obj = (amount, every, options = {}) => slice.obj({end: amount, every, ...options})
