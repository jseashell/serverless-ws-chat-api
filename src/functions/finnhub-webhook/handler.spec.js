const { finnhubWebhook } = require('./handler');
const { postToConnection } = require('../../libs/api-gateway');
const { scan } = require('../../libs/dynamodb');

// Mock wrapper libs
jest.mock('../../libs/api-gateway');
jest.mock('../../libs/dynamodb');

describe('finnhubWebhook', () => {
  const mockEvent = {
    body: JSON.stringify({ data: { message: 'webhook message' } }),
  };
  const mockContext = {};
  const mockConnections = [
    // at least 2 mocked database items with connection IDs
    {
      connectionId: {
        S: 'example-id-000',
      },
    },
    {
      connectionId: {
        S: 'example-id-111',
      },
    },
  ];
  let mockScan;
  let mockPostToConnection;

  beforeEach(() => {
    console.log = jest.fn();

    mockScan = jest.fn().mockResolvedValue({
      Items: mockConnections,
    });
    scan.mockImplementation(mockScan);

    mockPostToConnection = jest.fn();
    postToConnection.mockImplementation(mockPostToConnection);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 after successfully invoking the send handler', async () => {
    const response = await finnhubWebhook(mockEvent, mockContext);

    expect(mockScan).toHaveBeenCalled();
    expect(mockPostToConnection).toHaveBeenCalledTimes(2);
    expect(response.statusCode).toBe(200);
  });

  it('should return a 400 error when data is not provided in the request body', async () => {
    const invalidEvent = { body: JSON.stringify({ data: '' }) };

    const response = await finnhubWebhook(invalidEvent, mockContext);

    expect(mockScan).not.toHaveBeenCalled();
    expect(mockPostToConnection).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
  });

  it('should log errors when sending to a single client fails but still response with a 200', async () => {
    postToConnection.mockReset();
    const mockPostToConnectionError = jest.fn().mockImplementation(() => {
      throw new Error('test');
    });
    postToConnection.mockImplementation(mockPostToConnectionError);

    const mockErrorLog = jest.fn();
    console.error = mockErrorLog;

    const response = await finnhubWebhook(mockEvent, mockContext);

    expect(mockScan).toHaveBeenCalled();
    expect(mockPostToConnectionError).rejects;
    expect(mockErrorLog).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });
});
