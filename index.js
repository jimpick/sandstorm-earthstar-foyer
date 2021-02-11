const path = require('path')
const express = require('express')
const app = express()
const port = 8000

const baseDir = path.join(__dirname, 'earthstar-foyer')
const publicDir = path.join(baseDir, 'public')
const staticDir = path.join(baseDir, 'public/static')
const indexPath = path.join(publicDir, 'index.html')
console.log('public dir:', publicDir)
console.log('static dir:', staticDir)
console.log('index path:', indexPath)

app.use('/static', express.static(staticDir))

// serve the index path for any URL
app.get('*', (request, response) => {
  response.sendFile(indexPath)
})

const listener = app.listen(port, function () {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
