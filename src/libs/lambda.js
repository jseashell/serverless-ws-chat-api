/**
 * A successful Lambda Proxy response
 */
module.exports.successfulResponse = {
  statusCode: 200,
  body: JSON.stringify({ message: 'success' }),
};

/**
 * Formats a failure Lambda Proxy response
 *
 * @param {number} statusCode the HTTP status code for the error. 400 for client errors. 500 for internal errors.
 * @param {*} error String or Error object representing the error
 * @returns
 */
module.exports.formatJsonError = (statusCode, error) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: {
        message: error,
      },
    }),
  };
};
