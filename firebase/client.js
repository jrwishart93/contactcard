// firebase/client.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNBCnQYJAykquj_bVcXOdKfeU0So3Depc",
  authDomain: "contact-cards-b9175.firebaseapp.com",
  projectId: "contact-cards-b9175",
  storageBucket: "contact-cards-b9175.appspot.com",
  messagingSenderId: "1083444636856",
  appId: "1:1083444636856:web:82a43f44cf921dc9eb184d",
  measurementId: "G-EMC2XRVL0C",
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
