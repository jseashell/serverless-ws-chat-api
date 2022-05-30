/**
 * A successful Lambda Proxy response
 */
module.exports.successfulResponse = {
  statusCode: 200,
  body: JSON.stringify({ message: 'success' }),
};

/**
 * Formats a failure Lambda Proxy response
 * @param {number} statusCode the HTTP status code for the error. 400 for client errors. 500 for internal errors.
 * @param {*} error String or Error object representing the error
 * @returns
 */
module.exports.formatJsonError = (statusCode, error) => ({
  statusCode: statusCode,
  body: JSON.stringify({
    message: 'error',
    error: {
      message:
        typeof error == 'string'
          ? error
          : error.message
          ? error.message
          : 'Unknown error',
      stack: error.stack || {},
    },
  }),
});

/**
 * Sends data to the given connection ID using API Gateway Management
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
