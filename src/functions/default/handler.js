const { formatJsonError } = require('../../libs/api-gateway');

module.exports.defaultHandler = (event, _context, callback) => {
  console.warn(`Default handler invoked:\n${event}`);
  callback(null, formatJsonError(404, 'No handler found'));
};
