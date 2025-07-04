

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const mocks = {
    getFirestore: jest.fn(() => ({})),
    setLogLevel: jest.fn(),
  };
  return { __esModule: true, ...mocks };
});

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInAnonymously: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
}));

const REQUIRED = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
];

const originalEnv = { ...process.env };

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  REQUIRED.forEach(v => (process.env[v] = 'test'));
});

afterEach(() => {
  process.env = originalEnv;
});

describe('firebase config validation', () => {
  it('throws error when env vars missing', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const { default: validateConfig } = require('../firebase/validateConfig');
    expect(() => validateConfig()).toThrow(/NEXT_PUBLIC_FIREBASE_API_KEY/);
  });

  it('does not throw when all vars present', () => {
    const { default: validateConfig } = require('../firebase/validateConfig');
    expect(() => validateConfig()).not.toThrow();
  });
});

describe('firestore log level', () => {
  it('enables debug logging when not in production', () => {
    (process.env as any).NODE_ENV = 'development';
    require('../firebase/client');
    const { setLogLevel } = require('firebase/firestore');
    expect(setLogLevel).toHaveBeenCalledWith('debug');
  });

  it('does not enable debug logging in production', () => {
    (process.env as any).NODE_ENV = 'production';
    require('../firebase/client');
    const { setLogLevel } = require('firebase/firestore');
    expect(setLogLevel).not.toHaveBeenCalled();
  });
});

export {};
