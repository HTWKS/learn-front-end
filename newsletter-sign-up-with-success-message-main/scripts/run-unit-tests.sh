#!/bin/bash

set -euo pipefail
BASEDIR=$(dirname $0)

printf "\360\237\215\272\t Running unit tests...  \n"
pushd ${BASEDIR}/../src
npm run test