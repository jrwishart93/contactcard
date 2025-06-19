const request = require('supertest');
const app = require('../server');

describe('/api/uk-addresses', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns addresses from the postcode API', async () => {
    const addresses = ['1 Main St', '2 High St'];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: addresses })
    });

    const res = await request(app)
      .get('/api/uk-addresses')
      .query({ postcode: 'EH1 1AB' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ addresses });
  });
});
