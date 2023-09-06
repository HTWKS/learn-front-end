#!/bin/bash

set -euo pipefail

BASEDIR=$(dirname $0)

printf "\360\237\215\272\t Running unit tests...  \n"
${BASEDIR}/run-unit-tests.sh

printf "\360\237\215\272\t Running e2e tests...  \n"
${BASEDIR}/run-e2e-tests.sh
