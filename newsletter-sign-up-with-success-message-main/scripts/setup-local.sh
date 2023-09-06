#!/bin/bash

set -euo pipefail

BASEDIR=$(dirname $0)

step () {
  printf "🔷 $1 \n"
}

success () {
  printf "\n🍺 $1 \n\n"
}

step "Setup the web"
pushd ${BASEDIR}/../src
npm install
npm audit fix
popd

step "Setup E2E"
pushd ${BASEDIR}/../src/ts/__test__/e2e
npm install
npm audit fix
popd

success "Done"
