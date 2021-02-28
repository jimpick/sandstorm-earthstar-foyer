// export https_proxy=http://127.0.0.1:4000

const fs = require('fs')
const request = require('request')

const caPath = '/var/ca-spoof-cert.pem'
const ca = [fs.readFileSync(caPath, {encoding: 'utf-8'})]

const url =
  'https://ipfs.io/ipfs/QmeeLUVdiSTTKQqhWqsffYDtNvvvcTfJdotkNyi1KDEJtQ'
console.log('Fetching...', url, 'via', process.env.http_proxy)

request({
  uri: url,
  proxy: 'http://127.0.0.1:4000',
  ca
}, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('headers:', response && response.headers)
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

