const fs = require('fs')
const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const httpProxy = require('http-proxy')
const request = require('request') // deprecated, try axios?
const pub = require('./earthstar-pub')

const app = express()

const caPath = '/var/ca-spoof-cert.pem'
const ca = [fs.readFileSync(caPath, { encoding: 'utf-8' })]

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

app.get('/fetch', (req, res) => {
  const url =
    'https://ipfs.io/ipfs/QmeeLUVdiSTTKQqhWqsffYDtNvvvcTfJdotkNyi1KDEJtQ'
  console.log('Fetching...', url, 'via', process.env.https_proxy)
  request(
    {
      uri: url,
      proxy: process.env.https_proxy,
      ca
    },
    function (error, response, body) {
      if (error) {
        console.error('error:', error)
        res.status(500).send('Error')
        return
      }
      console.log('headers:', response && response.headers)
      console.log('statusCode:', response && response.statusCode)
      console.log('body:', body)
      res.status(response.statusCode).send(body)
    }
  )
})

var proxyRouter = express.Router()

proxyRouter.use(
  bodyParser.raw({
    type: '*/*'
  })
)

proxyRouter.all('/:protocol/:host/', (req, res) => {
  console.log(`Proxy ${req.method} `, req.url, req.params, req.query)
  console.log(`Proxy ${req.method} headers`, req.headers)
  console.log(`Proxy ${req.method} body`, req.body)
  const match =
    req.query.token && req.query.token.match(/^(.*)\/(earthstar-api.*)/)
  if (match) {
    const token = match[1]
    const apiPath = match[2].replace(' ', '+')
    const url =
      `${req.params.protocol}://${req.params.host}` +
      `/${apiPath}?token=${token}`
    const headers = {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      'accept-language': req.headers['accept-language'],
      'user-agent': req.headers['user-agent'],
      accept: req.headers['accept'],
      'accept-encoding': req.headers['accept-encoding']
      // authorization: `Bearer ${token}`, // Gets stripped by Sandstorm
    }
    console.log(`Proxy ${req.method} url`, url)
    console.log(`Proxy ${req.method} sending headers`, headers)
    const options = {
      method: req.method,
      uri: url,
      proxy: process.env.https_proxy,
      ca,
      headers
    }
    if (req.method === 'POST') {
      options.body = req.body
    }
    request(options, function (error, response, body) {
      if (error) {
        console.error('error:', error)
        res.status(500).send('Error')
        return
      }
      console.log('headers:', response && response.headers)
      console.log('statusCode:', response && response.statusCode)
      console.log('body:', body)
      res
        .status(response.statusCode)
        .set(response.headers)
        .send(body)
    })
  } else {
    res.status(400).send('Invalid target URL')
  }
})

app.use('/proxy', proxyRouter)

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
