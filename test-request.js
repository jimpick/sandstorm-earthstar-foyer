// export http_proxy=http://127.0.0.1:4000

const request = require('request')
const url =
  'http://ipfs.io/ipfs/QmeeLUVdiSTTKQqhWqsffYDtNvvvcTfJdotkNyi1KDEJtQ'
console.log('Fetching...', url, 'via', process.env.http_proxy)

request(url, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('headers:', response && response.headers)
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

