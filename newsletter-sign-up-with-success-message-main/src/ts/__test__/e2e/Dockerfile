FROM cypress/base:latest

WORKDIR /e2e

COPY . .
WORKDIR /e2e/__test__/e2e
RUN npm install
RUN npm run cy:install

ENTRYPOINT ["./scripts/entrypoint.sh"]