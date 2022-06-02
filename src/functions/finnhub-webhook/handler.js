const { postToConnection } = require('../../libs/api-gateway');
const { scan } = require('../../libs/dynamodb');
const { successfulResponse, formatJsonError } = require('../../libs/lambda');
const { connect } = require('../connect/handler');
const { disconnect } = require('../disconnect/handler');
/**
 * Handles webhook events from Finnhub. Sends the event data to all clients in the WS connection pool (stored in a DynamoDB instance).
 *
 * @param {*} event
 * @returns a Promise with an HTTP status code. 200 for successful events
 */
module.exports.finnhubWebhook = async (event) => {
  let data = JSON.parse(event.body).data; // Lambda Proxy integration always has a string body
  if (!data) {
    return formatJsonError(
      400,
      'Invalid body. Body must include a data property to send to other clients.'
    );
  }

  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }

  connect(event)
    .then(() => console.log('webhook connected'))
    .then(() => disconnect(event))
    .catch((err) => console.error(err));

  const connections = await scan();
  connections.Items?.forEach(async (connection) => {
    try {
      await postToConnection(event, connection.connectionId?.S, data);
    } catch (err) {
      console.error(err);
    }
  });
  return successfulResponse;
};
