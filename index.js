const fs = require('fs')
const http = require('http')
const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy')
const fetch = require('fetch-with-proxy').default
const pub = require('./earthstar-pub')
const app = express()

const server = require('http').createServer(app)
const port = 8000

const proxy = httpProxy.createProxyServer({
  target: 'http://127.0.0.1:3000',
  ws: true
})

const baseDir = path.join(__dirname, 'earthstar-foyer')
const publicDir = path.join(baseDir, 'public')
const staticDir = path.join(baseDir, 'public/static')
const indexPath = path.join(publicDir, 'index.html')
console.log('public dir:', publicDir)
console.log('static dir:', staticDir)
console.log('index path:', indexPath)

app.use('/static', express.static(staticDir))

const dataFolder = '/var/data'

fs.mkdirSync('/var/data', { recursive: true })

pubApp = pub.makeExpressApp({
  readonly: false, // if true, don't accept any new data from users to any workspace
  allowPushToNewWorkspaces: true, // if true, let users add new workspaces
  discoverableWorkspaces: false, // if true, show workspace addesses in the web interface
  storageType: 'sqlite', // use sqlite instead of memory to store data
  dataFolder: dataFolder, // put sqlite files here
  logLevel: 2 // 2 = verbose, 3 = include sensitive info (workspace addresses)
})

app.use('/pub', pubApp)

app.get('/fetch', (request, response) => {
  const url =
    'http://ipfs.io/ipfs/QmeeLUVdiSTTKQqhWqsffYDtNvvvcTfJdotkNyi1KDEJtQ'
  console.log('Fetching...', url, 'via', process.env.http_proxy)
  fetch(url)
    .then(response => response.text())
    .then(result => {
      response.send(result)
    })
    .catch(err => {
      console.error(err)
      response.status(500).send('Error')
    })
})

// serve the index path for any URL
app.get('*', (request, response) => {
  response.sendFile(indexPath)
})

proxy.on('error', function (err, req, res) {
  console.error('Proxy error', err)
  /*
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })
  */

  res.end('Something went wrong with the proxy.')
})

// https://gist.github.com/hhanh00/ddf3bf62294fc420a0de
server.on('upgrade', function (req, socket, head) {
  console.log('proxying upgrade request', req.url)
  proxy.ws(req, socket, head)
})

const listener = server.listen(port, function () {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
