import { connect } from './handler';

describe('connect', () => {
  it('should return a 400 error when a connection ID is not provided in the request context', () => {
    connect({ requestContext: { someOtherKey: 'any' } })
      .then(() => jest.fail())
      .catch((err) => {
        expect(err).toBeTruthy();
      });
  });
});
