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

module.exports.connect = async (event, _context, _callback) => {
  const connectionId = event.requestContext?.connectionId;
  if (!connectionId) {
    throw new Error(
      `Cannot add connection. Invalid connection ID "${connectionId}"`
    );
  }

  const command = new PutItemCommand({
    TableName: connectionTable,
    Item: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.REGION });
  return client
    .send(command)
    .then(() => successfulResponse)
    .catch((err) => formatJsonError(500, err));
};

module.exports.disconnect = async (event) => {
  const connectionId = event.requestContext?.connectionId;
  if (!connectionId) {
    throw new Error(
      `Cannot delete connection. Invalid connection ID "${connectionId}"`
    );
  }

  const command = new DeleteItemCommand({
    TableName: connectionTable,
    Key: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.REGION });
  return client
    .send(command)
    .then(() => successfulResponse)
    .catch((err) => formatJsonError(500, err));
};

module.exports.defaultHandler = async (event, _context, _callback) => {
  console.warn(`Default handler invoked:\n${event}`);
  return formatJsonError(404, 'No handler found');
};

module.exports.broadcast = async (event, _context, _callback) => {
  return getAllConnections()
    .then((connectionData) => {
      connectionData.Items?.forEach((connection) => {
        send(event, connection.connectionId?.S);
      });
    })
    .then(() => ({
      statusCode: 200,
      body: '...Sent!',
    }))
    .catch((err) => formatJsonError(500, err));
};

const getAllConnections = async () => {
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new ScanCommand({
    TableName: connectionTable,
    ProjectionExpression: 'connectionId',
  });
  return client.send(command);
};

const send = (event, connectionId) => {
  if (!event.body?.data || event.body?.data?.length == 0) {
    throw new Error('Cannot broadcast an empty message');
  }

  const postData = JSON.parse(event.body).data; // Lambda Proxy integration always has a string body

  if (typeof postData === 'object') {
    postData = JSON.stringify(postData);
  }

  console.debug('POST TO CONNECTION', connectionId);
  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: postData,
  });

  new ApiGatewayManagementApiClient({
    region: process.env.REGION,
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  }).send(command);
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
