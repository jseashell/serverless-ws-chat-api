const { deleteItem } = require('../../libs/dynamodb');
const { successfulResponse, formatJsonError } = require('../../libs/lambda');

/**
 * WS disconnect event handler. Removes the request context's connection ID from the DynamoDB instance
 *
 * @param {*} event Lambda Proxy event
 * @param {*} _context event content, unused
 * @param {*} callback Callback for API responses
 * @returns a Promised void
 */
module.exports.disconnect = async (event, _context, callback) => {
  const connectionId = event.requestContext?.connectionId;
  if (!connectionId) {
    callback(
      formatJsonError(
        400,
        'Cannot delete connection due to falsy connection ID.'
      )
    );
    return;
  }

  try {
    deleteItem(connectionId);
    callback(null, successfulResponse);
  } catch (err) {
    callback(formatJsonError(500, err));
  }
};
