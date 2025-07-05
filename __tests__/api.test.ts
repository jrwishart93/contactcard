const request = require('supertest');
const express = require('express');

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/firestore', () => {
  const mocks = {
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn(() => ({})),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    collection: jest.fn(() => ({})),
  };
  return { __esModule: true, ...mocks };
});

jest.mock('resend', () => {
  const send = jest.fn();
  return { __esModule: true, Resend: jest.fn().mockImplementation(() => ({ emails: { send } })), _send: send };
});

const { setDoc, getDoc, getDocs } = require('firebase/firestore');
const { Resend, _send: emailsSend } = require('resend');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.RESEND_API_KEY = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test';
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'test';
  process.env.GETADDRESS_API_KEY = 'test';
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test';
  process.env.BASE_URL = 'http://localhost';
});

describe('firebase config validation for API routes', () => {
  const modules = [
    '../pages/api/submit.ts',
    '../pages/api/report-lookup.ts',
    '../pages/api/final-summary.ts',
  ];

  test.each(modules)('%s throws when env vars missing', async mod => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const handler = require(mod).default;
    await expect(handler({ method: 'POST', body: {}, query: {} }, {})).rejects.toThrow(
      /NEXT_PUBLIC_FIREBASE_API_KEY/
    );
  });
});

describe('/api/submit', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/submit.ts').default;
    app = express();
    app.use(express.json());
    app.post('/api/submit', (req, res) => handler(req, res));
  });

  it('saves submission and sends email', async () => {
    setDoc.mockResolvedValue();
    emailsSend.mockResolvedValue();

    const res = await request(app)
      .post('/api/submit')
      .send({
        incidentNumber: 'INC1',
        userId: 'USER1',
        fullName: 'Test',
        email: 'test@example.com',
        constable: 'c',
        location: 'loc',
        locationNotes: 'notes',
        vehicle: {},
        insurance: {},
      });

    expect(res.status).toBe(200);
    expect(setDoc).toHaveBeenCalled();
    expect(emailsSend).toHaveBeenCalled();
  });
});

describe('/api/report-lookup', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/report-lookup.ts').default;
    app = express();
    app.use(express.json());
    app.post('/api/report-lookup', (req, res) => handler(req, res));
  });

  it('returns 400 if missing params', async () => {
    const res = await request(app).post('/api/report-lookup').send({});
    expect(res.status).toBe(400);
  });

  it('returns incident data when found', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ foo: 'bar' }) });
    getDocs.mockResolvedValue({ docs: [{ id: '1', data: () => ({ email: 'a@b.com' }) }] });

    const res = await request(app)
      .post('/api/report-lookup')
      .send({ policeRef: 'REF', incidentDate: '2023-01-01', email: 'a@b.com' });

    expect(res.status).toBe(200);
    expect(res.body.incident.id).toContain('PS-');
  });
});

describe('/api/address-lookup', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/address-lookup.js').default;
    app = express();
    app.get('/api/address-lookup', (req, res) => handler(req, res));
  });

  it('requires postcode parameter', async () => {
    const res = await request(app).get('/api/address-lookup');
    expect(res.status).toBe(400);
  });

  it('returns addresses from API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ features: [{ place_name: 'a' }, { place_name: 'b' }] }),
    });
    const res = await request(app)
      .get('/api/address-lookup')
      .query({ postcode: 'AB1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ addresses: ['a', 'b'] });
  });
});

describe('/api/sendEmail', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/sendEmail.ts').default;
    app = express();
    app.use(express.json());
    app.all('/api/sendEmail', (req, res) => handler(req, res));
  });

  it('proxies request and returns ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({});
    const res = await request(app)
      .post('/api/sendEmail')
      .send({ foo: 'bar' });
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('rejects non-POST requests', async () => {
    const res = await request(app).get('/api/sendEmail');
    expect(res.status).toBe(405);
  });
});

describe('/api/resend', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/resend.ts').default;
    app = express();
    app.use(express.json());
    app.all('/api/resend', (req, res) => handler(req, res));
  });

  it('calls sendEmail endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValue({});
    const res = await request(app).post('/api/resend').send({ id: '123' });
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('rejects non-POST requests', async () => {
    const res = await request(app).get('/api/resend');
    expect(res.status).toBe(405);
  });
});

describe('/api/final-summary', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/final-summary.ts').default;
    app = express();
    app.use(express.json());
    app.post('/api/final-summary', (req, res) => handler(req, res));
  });

  it('returns 404 when no submissions', async () => {
    getDocs.mockResolvedValue({ docs: [] });
    const res = await request(app)
      .post('/api/final-summary?id=ID1')
      .send({ officerEmail: 'o@b.com' });
    expect(res.status).toBe(404);
  });

  it('sends summary email', async () => {
    getDocs.mockResolvedValue({ docs: [{ id: '1', data: () => ({ email: 'a@b.com' }) }] });
    emailsSend.mockResolvedValue();

    const res = await request(app)
      .post('/api/final-summary?id=ID1')
      .send({ officerEmail: 'off@b.com' });

    expect(res.status).toBe(200);
    expect(emailsSend).toHaveBeenCalled();
  });
});

export {};
