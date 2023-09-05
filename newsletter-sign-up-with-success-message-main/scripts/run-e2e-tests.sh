#!/bin/bash

set -euo pipefail

printf "\360\237\215\272\t Running e2e tests...  \n"
docker-compose -f "docker-compose-e2e.yml" up --build --abort-on-container-exit && docker-compose -f "docker-compose-e2e.yml" down
