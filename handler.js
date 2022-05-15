'use strict';
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');
const { DynamoDBClient, PutItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');

const CONNECTION_DB_TABLE = process.env.CONNECTION_DB_TABLE;

const successfulResponse = {
  statusCode: 200,
  body: 'Success',
};

const failedResponse = (statusCode, error) => ({
  statusCode,
  body: error,
});

module.exports.connectHandler = (event, context, callback) => {
  addConnection(event.requestContext.connectionId)
    .then(() => {
      callback(null, successfulResponse);
    })
    .catch((err) => {
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

module.exports.disconnectHandler = (event, context, callback) => {
  deleteConnection(event.requestContext.connectionId)
    .then(() => {
      callback(null, successfulResponse);
    })
    .catch((err) => {
      console.error(err);
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

module.exports.defaultHandler = (event, context, callback) => {
  callback(null, failedResponse(404, 'No event found'));
};

module.exports.sendMessageHandler = (event, context, callback) => {
  sendMessageToAllConnected(event)
    .then(() => {
      callback(null, successfulResponse);
    })
    .catch((err) => {
      console.error(err);
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

const sendMessageToAllConnected = (event) => {
  return getAllConnections().then((connectionData) => {
    return connectionData.Items.map((connectionId) => {
      return send(event, connectionId.connectionId);
    });
  });
};

const getAllConnections = async () => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    ProjectionExpression: 'connectionId',
  };
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new ScanCommand(params);
  return await client.send(command);
};

const send = async (event, connectionId) => {
  const body = JSON.parse(event.body);
  let postData = body.data;
  console.log('Sending.....');

  if (typeof postData === 'object') {
    console.log('It was an object');
    postData = JSON.stringify(postData);
  } else if (typeof postData === 'string') {
    console.log('It was a string');
  }

  const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage;
  const client = ApiGatewayManagementApiClient({
    region: process.env.REGION,
    endpoint: endpoint,
  });

  const params = {
    ConnectionId: connectionId,
    Data: postData,
  };
  const command = new PostToConnectionCommand(params);
  const data = await client.send(command);
  console.info('Broadcasted a message', { params }, { data });
};

const addConnection = async (connectionId) => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    Item: {
      connectionId: connectionId,
    },
  };

  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new PutItemCommand(params);

  // async/await.
  try {
    const data = await client.send(command);
    console.info('New connection', { data });
  } catch (error) {
    console.error('Failed to add connection', { error });
    throw error;
  }
};

const deleteConnection = async (connectionId) => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    Key: {
      connectionId: connectionId,
    },
  };

  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new DeleteItemCommand(params);

  // async/await.
  try {
    const data = await client.send(command);
    console.info('Deleted connection', { data });
  } catch (error) {
    console.error('Failed to delete connection', { error });
    throw error;
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
