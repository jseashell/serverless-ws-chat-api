const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require('@aws-sdk/client-apigatewaymanagementapi');

/**
 * Sends data to the given connection ID using API Gateway Management
 *
 * @param {*} event the Lambda Proxy request event
 * @param {*} connectionId the connection ID to send the data to
 * @param {*} data to send
 * @returns a Promise containing command output metadata
 */
module.exports.postToConnection = async (event, connectionId, data) => {
  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: data,
  });

  const client = new ApiGatewayManagementApiClient({
    region: process.env.REGION,
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  return client.send(command);
};
