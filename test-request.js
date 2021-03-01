// export https_proxy=http://127.0.0.1:4000

const proxy="http://127.0.0.1:4000"

// https://api-cb03e1f55c3f9560333de3368f961139.raun4egt.hex.camp#_YNnn0nD7EJ1Iswt39WPA9FsJ81wxO_sGAMuyXknWty

// curl -X POST -k -H "Authorization: Bearer _YNnn0nD7EJ1Iswt39WPA9FsJ81wxO_sGAMuyXknWty" -H "Content-Type: application/json" -d "[]" https://api-cb03e1f55c3f9560333de3368f961139.raun4egt.hex.camp/earthstar-api/v1/+lobbydev.a1/documents
// wget -q -O - --header="Authorization: Bearer _YNnn0nD7EJ1Iswt39WPA9FsJ81wxO_sGAMuyXknWty" https://api-cb03e1f55c3f9560333de3368f961139.raun4egt.hex.camp/earthstar-api/v1/+lobbydev.a1/documents

const token="_YNnn0nD7EJ1Iswt39WPA9FsJ81wxO_sGAMuyXknWty"

const fs = require('fs')
const request = require('request')

const caPath = '/var/ca-spoof-cert.pem'
const ca = [fs.readFileSync(caPath, {encoding: 'utf-8'})]

const url = 'https://api-cb03e1f55c3f9560333de3368f961139.raun4egt.hex.camp/earthstar-api/v1/+lobbydev.a1/documents'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

console.log('Fetching...', url, 'via', proxy)

request({
  method: 'POST',
  uri: url,
  proxy,
  ca,
  headers,
  json: []
}, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('headers:', response && response.headers)
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

