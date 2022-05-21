const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require('@aws-sdk/client-apigatewaymanagementapi');
const {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
} = require('@aws-sdk/client-dynamodb');

const connectionTable = process.env.CONNECTION_TABLE;

const successfulResponse = {
  statusCode: 200,
  body: 'Success',
};

const formatJsonError = (statusCode, err) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: {
        message: err.messge,
        stack: err.stack,
      },
    }),
  };
};

module.exports.connectHandler = async (event, _context, _callback) => {
  return addConnection(event.requestContext.connectionId)
    .then(() => {
      return successfulResponse;
    })
    .catch((err) => {
      return formatJsonError(500, err);
    });
};

module.exports.disconnectHandler = async (event) => {
  return deleteConnection(event.requestContext.connectionId)
    .then(() => {
      return successfulResponse;
    })
    .catch((err) => {
      return formatJsonError(500, err);
    });
};

module.exports.defaultHandler = async (event, _context, _callback) => {
  console.warn(`Default handler invoked:\n${event}`);
  return formatJsonError(404, 'No handler found');
};

module.exports.sendMessageHandler = async (event, _context, _callback) => {
  return sendMessageToAllConnected(event)
    .then(() => {
      return successfulResponse;
    })
    .catch((err) => {
      return failedResponse(500, JSON.stringify(err));
    });
};

const sendMessageToAllConnected = (event) => {
  return getAllConnections().then((connectionData) => {
    return connectionData.Items.map((connectionId) => {
      return send(event, connectionId.connectionId);
    });
  });
};

const send = (event, connectionId, postData) => {
  const endpoint =
    event.requestContext.domainName + '/' + event.requestContext.stage;
  const client = new ApiGatewayManagementApiClient({
    region: process.env.REGION,
    endpoint: endpoint,
  });

  if (typeof postData === 'object') {
    postData = JSON.stringify(postData);
  }

  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: postData,
  });

  return client.send(command);
};

const getAllConnections = () => {
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new ScanCommand({
    TableName: connectionTable,
    ProjectionExpression: 'connectionId',
  });
  return client.send(command);
};

const addConnection = async (connectionId) => {
  const command = new PutItemCommand({
    TableName: connectionTable,
    Item: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.REGION });
  try {
    const data = await client.send(command);
    console.info('New connection', { data });
    return data;
  } catch (error) {
    console.error('Failed to add connection', { error });
  }
};

const deleteConnection = async (connectionId) => {
  const command = new DeleteItemCommand({
    TableName: connectionTable,
    Key: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.REGION });
  try {
    const data = await client.send(command);
    console.info('Deleted connection', { data });
    return data;
  } catch (error) {
    console.error('Failed to delete connection', { error });
  }
};

// TODO
// module.exports.auth = async (event) => {
//   const apiOptions = {};
//   const tmp = event.methodArn.split(':');
//   const apiGatewayArnTmp = tmp[5].split('/');
//   const awsAccountId = tmp[4];
//   const region = tmp[3];
//   apiOptions.apiId = apiGatewayArnTmp[0];
//   apiOptions.stage = apiGatewayArnTmp[1];

//   var resourceArn = `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/${stage}/*`;

//   let effect = 'Deny';

//   const secret = event.authorizationToken || null;
//   if (secret) {
//     const finnhubSecret = 'ca0igiiad3i2bhd5pmc0';
//     const clientSecret = 'jcs080291';
//     if (secret === finnhubSecret || secret === clientSecret) {
//       effect = 'Allow';
//     }
//   }

//   // Finnhub API secret
//   //https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
//   const policy = {
//     principalId: '$context.authorizer.principalId',
//     policyDocument: {
//       Version: '2012-10-17',
//       Statement: [
//         {
//           Action: 'execute-api:Invoke',
//           Effect: effect,
//           Resource: resourceArn,
//         },
//       ],
//     },
//   };

//   if (secret) {
//     return {
//       ...policy,
//       usageIdentifierKey: secret,
//     };
//   }

//   return policy;
// };
