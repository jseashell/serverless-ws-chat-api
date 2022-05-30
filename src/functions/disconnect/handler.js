const {
  formatJsonError,
  successfulResponse,
} = require('../../libs/api-gateway');
const { deleteItem } = require('../../libs/dynamodb');

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
