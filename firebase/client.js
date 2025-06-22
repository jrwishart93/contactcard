// firebase/client.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import validateConfig from './validateConfig';

// Ensure required environment variables are present
validateConfig();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize firebase only once, even if hot-reloaded
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Enable verbose Firestore logs for easier debugging
setLogLevel('debug');

// Initialise analytics only in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const db = getFirestore(app);
