# backend-mock-server

Simulate the [Python backend](../backend/README.md) to ease the frontend developments.

This is a NodeJS server providing the same API as the backend.
It is powered by the [Nest](https://github.com/nestjs/nest) framework and written in TypeScript.

It has been initialized using nest@9.2.0: `npx @nestjs/cli new backend-mock-server`.


## Installation

Node: see [frontend requirements](../frontend/README.md).

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
