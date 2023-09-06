FROM cypress/base:latest

WORKDIR /e2e

COPY . .
WORKDIR /e2e/__test__/e2e
RUN CYPRESS_CACHE_FOLDER=./tmp/Cypress npm install

ENTRYPOINT ["./scripts/entrypoint.sh"]