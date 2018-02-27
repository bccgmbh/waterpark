const {createHash} = require('crypto')

process.on('message', (msg) => {
  const id = msg
  for (let i = 65536; i > 0; i--) {
    msg = createHash('sha256').update(msg.toString()).digest('hex')
  }
  process.send([id, msg])
})
