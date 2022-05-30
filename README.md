# Finnhub API

[![Build status](https://ci.appveyor.com/api/projects/status/br0ka84i48rapdcf?svg=true)](https://ci.appveyor.com/project/jseashell/finnhub-api)

Serverless websocket API serving Finnhub live data. Deployed with [AWS Lambda](https://aws.amazon.com/lambda/) and [Serverless Framework](https://serverless.com).

## Install

> Requires Node >=16 (lts/gallium). If you are using [nvm](https://github.com/nvm-sh/nvm), then run `nvm install` from the project directoy

```sh
git clone https://github.com/jseashell/finnhub-api.git
cd finnhub-api
npm install
```

## Test

```sh
# Run unit tests, watch available
npm test
npm run test:watch
```

## Environment

Environment variables are injected into the handler via [serverless.yml](./serverless.yml) config.

## Deploy

Deployment requires `aws configure` on the deployment workstation

```sh
npx serverless deploy
```

## Test

Use [wscat](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-wscat.html) to interact with the websocket channel.

The `<websocketApiId>` is available in your `serverless deploy` output. Copy and paste it into the command below to use the websocket API from terminal.

```sh
wscat -c wss://<websocketApiId>.execute-api.us-east-1.amazonaws.com/dev
```

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
