import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setLogLevel, type Firestore } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type Auth,
} from 'firebase/auth';

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

// Export auth instance for client usage
export const auth: Auth = getAuth(app);

// Enable verbose Firestore logs for easier debugging in non-production envs
if (process.env.NODE_ENV !== 'production') {
  setLogLevel('debug');
}

// Initialise analytics only in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const db: Firestore = getFirestore(app);

// Ensure unauthenticated visitors can still read reports
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, user => {
    if (!user) {
      signInAnonymously(auth).catch(console.error);
    }
  });
}
