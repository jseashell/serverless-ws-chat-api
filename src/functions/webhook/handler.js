const {
  successfulResponse,
  formatJsonError,
} = require('../../libs/api-gateway');
const { send } = require('../send/handler');

module.exports.webhook = async (event, context, _callback) => {
  return send(event, context)
    .then(() => successfulResponse)
    .catch((err) => {
      console.error(err);
      return formatJsonError(500, err);
    });
};
