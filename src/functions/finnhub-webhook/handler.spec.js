const { finnhubWebhook } = require('./handler');
const WebSocket = require('ws');

// Mock wrapper libs
jest.mock('../../libs/api-gateway');
jest.mock('../../libs/dynamodb');
jest.mock('ws');

describe('finnhubWebhook', () => {
  const mockEvent = {
    body: JSON.stringify({ data: { message: 'webhook message' } }),
  };
  const mockContext = {};

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 after successfully invoking the send handler', async () => {
    const mockSend = jest.fn();
    jest.spyOn(WebSocket.prototype, 'send').mockImplementationOnce(mockSend);

    const response = await finnhubWebhook(mockEvent, mockContext);

    expect(mockSend).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it('should return a 400 error when data is not provided in the request body', async () => {
    const invalidEvent = { body: JSON.stringify({ data: '' }) };
    const response = await finnhubWebhook(invalidEvent, mockContext);
    expect(response.statusCode).toBe(400);
  });

  it.skip('should log errors when sending to a single client fails but still response with a 200', async () => {
    const mockErrorLog = jest.fn();
    console.error = mockErrorLog;

    jest
      .spyOn(WebSocket.prototype, 'send')
      .mockRejectedValueOnce(new Error('test'));

    const response = await finnhubWebhook(mockEvent, mockContext);

    expect(mockErrorLog).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });
});
