const {Duplex, PassThrough} = require('stream')

// last parameter may be "options"
module.exports.compose = (...streams) => {
  if (streams.length === 0) return new PassThrough()
  let options = {}
  if (
    typeof streams[streams.length - 1] === 'object' &&
    typeof streams[streams.length - 1].pipe !== 'function'
  ) {
    console.log('[Compose] options', options)
    options = streams.pop()
  }
  if (streams.length === 0) {
    console.log('[Compose] Found only options => return PassThrough(options)')
    return new PassThrough(options)
  }
  const first = streams[0]
  const last = streams[streams.length - 1]

  if (first.writable && last.readable) {
    console.log('[Compose] DUPLEX')
  } else if (!first.writable && last.readable) {
    console.log('[Compose] READABLE')
  } else if (first.writable && !last.readable) {
    console.log('[Compose] WRITABLE')
  }

  // expose both ends
  const duplex = new Duplex({
    ...options,
    write: first.write.bind(first),
    end: first.end.bind(first),
    destroy: first.destroy.bind(first),
    read: last.read.bind(last),
    resume: last.resume.bind(last),
    pause: last.pause.bind(last)
  })

  streams.forEach(stream => stream.on('error', (...args) => duplex.emit('error', ...args)))

  // connect pipes
  console.log('[Compose] connecting %d streams', streams.length)
  let stream = streams.shift()
  while (streams.length > 0) {
    const next = streams.shift()
    console.log(`[Compose] pipe ${streamType(stream)} => ${streamType(next)}`)
    stream = stream.pipe(next)
  }

  last.on('data', (...args) => duplex.emit('data', ...args))
  last.on('close', (...args) => duplex.emit('close', ...args))
  first.on('drain', (...args) => duplex.emit('drain', ...args))
  last.on('end', (...args) => duplex.emit('end', ...args))

  last.on('finish', () => console.log('[Compose] Duplex.last FINISH'))
  last.on('end', () => console.log('[Compose] Duplex.last END'))
  last.on('drain', () => console.log('[Compose] Duplex.last DRAIN'))

  duplex.once('finish', () => {
    console.log('[Compose] Duplex FINISH')
    first.end()
  })

  return duplex
}

function streamType (stream) {
  if (
    typeof stream !== 'object' ||
    typeof stream.pipe !== 'function'
  ) {
    return 'INVALID'
  } else if (stream.writable && stream.readable) {
    return 'Transform'
  } else if (stream.writable) {
    return 'Writable'
  } else if (stream.readable) {
    return 'Readable'
  }
  return 'UNDEFINED'
}
