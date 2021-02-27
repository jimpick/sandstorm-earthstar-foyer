// export http_proxy=http://127.0.0.1:4000

const fetch = require('fetch-with-proxy').default
const url =
  'http://ipfs.io/ipfs/QmeeLUVdiSTTKQqhWqsffYDtNvvvcTfJdotkNyi1KDEJtQ'
console.log('Fetching...', url, 'via', process.env.http_proxy)
fetch(url)
  .then(response => response.text())
  .then(result => {
    console.log('Result', result)
  })
  .catch(err => {
    console.error(err)
  })

