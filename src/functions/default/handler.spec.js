const { defaultHandler } = require('./handler');

describe('defaultHandler', () => {
  const mockConnectionId = 'example-id-000';
  const mockEvent = { requestContext: { connectionId: mockConnectionId } };
  const mockContext = null; // unused in handler.js
  let mockWarn;

  beforeEach(() => {
    mockWarn = jest.fn();
    console.warn = mockWarn;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should log a warning', () => {
    defaultHandler(mockEvent, mockContext, jest.fn());
    expect(mockWarn).toHaveBeenCalled();
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
