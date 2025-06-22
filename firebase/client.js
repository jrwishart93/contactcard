// firebase/client.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { firebaseConfig, validateConfig } from './config';

// Ensure required environment variables are present
validateConfig();


// Initialize firebase only once, even if hot-reloaded
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Enable verbose Firestore logs for easier debugging
setLogLevel('debug');

// Initialise analytics only in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const db = getFirestore(app);
