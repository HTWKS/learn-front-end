FROM cypress/base:latest

WORKDIR /e2e

COPY . .
RUN npm install

ENTRYPOINT ["./scripts/entrypoint.sh"]