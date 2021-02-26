#! /bin/bash

export POWERBOX_WEBSOCKET_PORT=3000
export POWERBOX_PROXY_PORT=4000
export DB_TYPE=sqlite3
export DB_URI=/var/powerbox-http-proxy.sqlite3
export CA_CERT_PATH=/var/ca-spoof-cert.pem
rm -f $CA_CERT_PATH
/opt/app/.sandstorm/powerbox-http-proxy/powerbox-http-proxy 