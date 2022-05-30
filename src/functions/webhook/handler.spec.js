const { send } = require('../send/handler');
const { webhook } = require('./handler');

jest.mock('../send/handler');

describe('webhook', () => {
  const mockEvent = {
    body: JSON.stringify({ data: { message: 'webhook message' } }),
  };
  const mockContext = {}; // unused in handler.js
  let mockSend;

  beforeEach(() => {
    mockSend = jest.fn().mockResolvedValue();
    send.mockImplementation(mockSend);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 after successfully invoking the send handler', async () => {
    const response = await webhook(mockEvent, mockContext);

    expect(mockSend).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it('should return 500 if the send handler errors', async () => {
    send.mockReset();
    const mockSendError = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    send.mockImplementation(mockSendError);

    const response = await webhook(mockEvent, mockContext);

    expect(mockSendError).rejects;
    expect(response.statusCode).toBe(500);
  });
});
