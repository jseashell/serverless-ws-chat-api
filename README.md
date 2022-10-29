# Serverless Websocket Chat API

Serverless Websocket API for a cloud-based chat service. Deployed with [AWS Lambda](https://aws.amazon.com/lambda/) and [Serverless Framework](https://serverless.com).

## Install

> Requires Node >=16 (lts/gallium). If you are using [nvm](https://github.com/nvm-sh/nvm), then run `nvm install` from the project directoy

```sh
git clone https://github.com/jseashell/serverless-ws-chat-api.git
cd serverless-ws-chat-api
npm install
```

## Test

```sh
# Run unit tests with jest
npm test
```

Use [wscat](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-wscat.html) to interact with the websocket channel.

The `<websocketApiId>` is available in your `serverless deploy` output. Copy and paste it into the command below to use the websocket API from terminal.

```sh
wscat -c wss://<websocketApiId>.execute-api.us-east-1.amazonaws.com/dev
```

## Environment

Environment variables are injected into the handler via [serverless.yml](./serverless.yml) config.

## Deploy

Deployment requires `aws configure` on the deployment workstation

```sh
npx serverless deploy
```

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
