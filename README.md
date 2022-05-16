# Finnhub API

Serverless websocket API serving Finnhub live data. Deployed with [AWS Lambda](https://aws.amazon.com/lambda/) and [Serverless Framework](https://serverless.com).

## Install

```sh
git clone https://github.com/jseashell/finnhub-api.git
cd finnhub-api
npm install
```

## Environment

Environment variables are injected into the handler via [serverless.yml](./serverless.yml) config.

## Deploy

Deployment requires `aws configure` on the deployment workstation.

```sh
npm run serverless -- deploy
```

## Test

```sh
npm run invoke:connect
```

You should get a 200 response back. Clean up you connection with

```sh
npm run invoke:disconnect
```

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
