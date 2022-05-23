const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { connect } = require('./handler');

jest.mock('@aws-sdk/client-dynamodb');

describe('handler', () => {
  describe('connect', () => {
    const mockConnectionId = 'example-id-000';
    const mockEvent = { requestContext: { connectionId: mockConnectionId } };
    const mockContext = null; // unused in handler.js

    it("should insert the client's connection ID into an RDS database", async () => {
      const send = jest.fn();
      jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementationOnce(send);

      const callback = jest.fn();

      await connect(mockEvent, mockContext, callback);

      expect(send).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, {
        statusCode: 200,
        body: JSON.stringify({ message: 'success' }),
      });
    });

    it('should callback a 400 error when a connection ID is not provided in the request context', async () => {
      jest
        .spyOn(DynamoDBClient.prototype, 'send')
        .mockImplementationOnce(jest.fn());

      const invalidEvent = { requestContext: { someOtherKey: 'any' } };
      const mockCallback = jest.fn();

      await connect(invalidEvent, mockContext, mockCallback);

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

    it('should callback a 400 error when insertion fails', async () => {
      jest
        .spyOn(DynamoDBClient.prototype, 'send')
        .mockRejectedValueOnce(() => new Error('test'));

      const mockCallback = jest.fn();

      await connect(mockEvent, mockContext, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith({
        statusCode: 500,
        body: JSON.stringify({
          message: 'error',
          error: {
            message: 'Unknown error',
            stack: {},
          },
        }),
      });
    });
  });
});
