const pub = require('./earthstar-pub');
const path = require('path')
const express = require('express')
const fs = require('fs')
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

const dataFolder = '/var/data'

fs.mkdirSync('/var/data', { recursive: true })

pubApp = pub.makeExpressApp({
    readonly: false,  // if true, don't accept any new data from users to any workspace
    allowPushToNewWorkspaces: true,  // if true, let users add new workspaces
    discoverableWorkspaces: false,  // if true, show workspace addesses in the web interface
    storageType: 'sqlite',  // use sqlite instead of memory to store data
    dataFolder: dataFolder,  // put sqlite files here
    logLevel: 2,  // 2 = verbose, 3 = include sensitive info (workspace addresses)
})

app.use('/pub', pubApp)

// serve the index path for any URL
app.get('*', (request, response) => {
  response.sendFile(indexPath)
})


const listener = app.listen(port, function () {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
