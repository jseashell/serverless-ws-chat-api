# Serverless Lambda Chat API

[![Build status](https://ci.appveyor.com/api/projects/status/br0ka84i48rapdcf?svg=true)](https://ci.appveyor.com/project/jseashell/market-news-chat-api)
[![codecov](https://codecov.io/gh/jseashell/finnhub-api/branch/dev/graph/badge.svg?token=T7DDM5BHFV)](https://codecov.io/gh/jseashell/finnhub-api)
[![Known Vulnerabilities](https://snyk.io/test/github/jseashell/finnhub-api/badge.svg)](https://snyk.io/test/github/jseashell/finnhub-api/badge.svg)

Serverless AWS Lambda web socket API for streaming live chat data. [Deploy](#deploy) with [AWS Lambda](https://aws.amazon.com/lambda/) and [Serverless Framework](https://serverless.com).

<details>
<summary>Table of Contents</summary>

- [Install](#install)
- [Usage](#usage)
- [Test](#test)
- [Environment](#environment)
- [Deploy](#deploy)
- [License](#license)

</details>

## Install

> Requires Node >=16 (lts/gallium). If you are using [nvm](https://github.com/nvm-sh/nvm), then run `nvm install` from the project directoy

```sh
git clone https://github.com/jseashell/serverless-lambda-chat-api.git
cd serverless-lambda-chat-api
npm install
```

## Usage

[Deploy](#deploy) to AWS, then use [wscat](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-wscat.html) to interact with the websocket.

The `<aws-endpoint>` is available in your `serverless deploy` output. Copy and paste it into the command below to use the websocket API from terminal.

```sh
wscat -c <aws-endpoint>
```

> It looks something like this `wss://0a0a0a0a0a.execute-api.us-east-1.amazonaws.com/dev`

## Test

```sh
# Run unit tests, watch available
npm test
npm run test:watch

# Run security tests
npm run snyk
```

## Environment

Environment variables are injected into the handler via [serverless.yml](./serverless.yml) config.

## Deploy

This API is configured to deploy to AWS.

### Local

Deployment requires `aws configure` on the deployment workstation

```sh
npx serverless deploy
```

### Remote

CI/CD can be serviced by [AppVeyor](https://appveyor.com/). You must login with your Github (or other supported provider) account to link the repository. Configuration, such as AWS IAM credentials, is kept in [appveyor.yml](./appveyor.yml). Only the `dev` and `main` branches are deployed.

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
