const { createHash } = require('crypto')

process.on('message', (msg) => {
  for (let i = 1e5; i > 0; i--) {
    msg = createHash('sha256').update(msg.toString()).digest('hex')
  }
  process.send(msg)
})
