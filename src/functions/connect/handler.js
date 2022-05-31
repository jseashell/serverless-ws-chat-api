const { putItem } = require('../../libs/dynamodb');
const { successfulResponse, formatJsonError } = require('../../libs/lambda');

/**
 * WS connect event handler. Stores the request context's connection ID in an DynamoDB instance
 *
 * @param {*} event Lambda Proxy event
 * @param {*} _context event content, unused
 * @param {*} callback Callback for API responses
 * @returns a Promised void
 */
module.exports.connect = async (event, _context, callback) => {
  const connectionId = event.requestContext?.connectionId;
  if (!connectionId) {
    callback(
      formatJsonError(400, 'Cannot add connection due to falsy connection ID.')
    );
    return;
  }

  try {
    putItem(connectionId);
    callback(null, successfulResponse);
  } catch (err) {
    callback(formatJsonError(500, err));
  }
};
