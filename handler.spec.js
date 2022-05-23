const { connect } = require('./handler');

describe('connect', () => {
  const mockContext = null; // unused in handler.js

  it('should return a 400 error when a connection ID is not provided in the request context', () => {
    const mockEvent = { requestContext: { someOtherKey: 'any' } };
    const mockCallback = jest.fn();

    connect(mockEvent, mockContext, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith({
      statusCode: 400,
      body: JSON.stringify({
        message: 'error',
        error: {
          message: 'Cannot add connection due to falsy connection ID.',
          stack: {},
        },
      }),
    });
  });
});
