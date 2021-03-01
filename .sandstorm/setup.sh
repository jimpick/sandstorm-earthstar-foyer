#!/bin/bash

# When you change this file, you must take manual action. Read this doc:
# - https://docs.sandstorm.io/en/latest/vagrant-spk/customizing/#setupsh

set -euo pipefail
# Install node.js

# Discussion, issues and change requests at:
#   https://github.com/nodesource/distributions
#
# Script to install the NodeSource Node.js 10.x repo onto a
# Debian or Ubuntu system.

export DEBIAN_FRONTEND=noninteractive

# Install Go, for the powerbox server:
curl -sL https://dl.google.com/go/go1.16.linux-amd64.tar.gz -o /usr/local/go.tar.gz
(cd /usr/local && tar -xvf go.tar.gz)
cat > /etc/profile.d/go.sh <<"EOF"
export PATH="$PATH:/usr/local/go/bin"
EOF

#echo "Installing the NodeSource Node.js 10.x repo..."

apt-get update
apt-get install -qq apt-transport-https

#curl -sL https://deb.nodesource.com/setup_10.x | bash -

# Actually install node
#apt-get install -qq nodejs git-core g++
apt-get install -qq git-core g++

curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs

npm install -g nodemon

exit 0
