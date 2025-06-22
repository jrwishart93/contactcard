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

jest.mock('../firebase/config', () => ({
  firebaseConfig: {},
  validateConfig: jest.fn(),
}));

const { setDoc, getDoc, getDocs } = require('firebase/firestore');
const { Resend, _send: emailsSend } = require('resend');
const { validateConfig } = require('../firebase/config');

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
  process.env.BASE_URL = 'http://localhost';
});

describe('firebase config validation for API routes', () => {
  const modules = [
    '../pages/api/submit.js',
    '../pages/api/report-lookup.js',
    '../pages/api/final-summary.js',
  ];

  test.each(modules)('%s throws when env vars missing', mod => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    expect(() => require(mod)).toThrow(/NEXT_PUBLIC_FIREBASE_API_KEY/);
  });
});

describe('/api/submit', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/submit.js').default;
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
        vehicle: {},
        insurance: {},
      });

    expect(res.status).toBe(200);
    expect(setDoc).toHaveBeenCalled();
    expect(emailsSend).toHaveBeenCalled();
    expect(validateConfig).toHaveBeenCalled();
  });
});

describe('/api/report-lookup', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/report-lookup.js').default;
    app = express();
    app.use(express.json());
    app.post('/api/report-lookup', (req, res) => handler(req, res));
  });

  it('returns 400 if missing params', async () => {
    const res = await request(app).post('/api/report-lookup').send({});
    expect(res.status).toBe(400);
    expect(validateConfig).toHaveBeenCalled();
  });

  it('returns incident data when found', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ foo: 'bar' }) });
    getDocs.mockResolvedValue({ docs: [{ id: '1', data: () => ({ email: 'a@b.com' }) }] });

    const res = await request(app)
      .post('/api/report-lookup')
      .send({ policeRef: 'REF', incidentDate: '2023-01-01', email: 'a@b.com' });

    expect(res.status).toBe(200);
    expect(res.body.incident.id).toContain('PS-');
    expect(validateConfig).toHaveBeenCalled();
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
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ addresses: ['a', 'b'] }) });
    const res = await request(app).get('/api/address-lookup').query({ postcode: 'AB1' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ addresses: ['a', 'b'] });
  });
});

describe('/api/sendEmail', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/sendEmail.js').default;
    app = express();
    app.use(express.json());
    app.post('/api/sendEmail', (req, res) => handler(req, res));
  });

  it('proxies request and returns ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({});
    const res = await request(app)
      .post('/api/sendEmail')
      .send({ foo: 'bar' });
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalled();
  });
});

describe('/api/resend', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/resend.js').default;
    app = express();
    app.get('/api/resend', (req, res) => handler(req, res));
  });

  it('calls sendEmail endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValue({});
    const res = await request(app).get('/api/resend').query({ id: '123' });
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalled();
  });
});

describe('/api/final-summary', () => {
  let app;
  beforeEach(() => {
    const handler = require('../pages/api/final-summary.js').default;
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
    expect(validateConfig).toHaveBeenCalled();
  });

  it('sends summary email', async () => {
    getDocs.mockResolvedValue({ docs: [{ id: '1', data: () => ({ email: 'a@b.com' }) }] });
    emailsSend.mockResolvedValue();

    const res = await request(app)
      .post('/api/final-summary?id=ID1')
      .send({ officerEmail: 'off@b.com' });

    expect(res.status).toBe(200);
    expect(emailsSend).toHaveBeenCalled();
    expect(validateConfig).toHaveBeenCalled();
  });
});
