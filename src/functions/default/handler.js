const { formatJsonError } = require('../../libs/lambda');

/**
 * WS default event handler for any routes without handlers
 *
 * @param {*} event Lambda Proxy event
 * @param {*} _context event content, unused
 * @param {*} callback Callback for API responses. Always calls back 404 error
 * @returns a Promised void
 */
module.exports.defaultHandler = (event, _context, callback) => {
  console.warn(`Default handler invoked:\n${event}`);
  callback(null, formatJsonError(404, 'No handler found'));
};
