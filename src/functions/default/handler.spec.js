const { defaultHandler } = require('./handler');

describe('defaultHandler', () => {
  const mockConnectionId = 'example-id-000';
  const mockEvent = { requestContext: { connectionId: mockConnectionId } };
  const mockContext = null; // unused in handler.js

  beforeEach(() => {
    console.warn = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return a 404', () => {
    const mockCallback = jest.fn();
    defaultHandler(mockEvent, mockContext, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });
});
