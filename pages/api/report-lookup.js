import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!getApps().length) initializeApp(firebaseConfig);
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { policeRef, incidentDate, email } = req.body || {};
  if (!policeRef || !incidentDate || !email) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const id = `PS-${incidentDate.replace(/-/g, '')}-${policeRef}`;
    const docRef = doc(db, 'rtc', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return res.status(404).json({ error: 'not found' });
    }
    const data = snap.data();
    const subsSnap = await getDocs(collection(db, 'rtc', id, 'submissions'));
    const submissions = subsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const hasEmail = submissions.some(s => s.email && s.email.toLowerCase() === email.toLowerCase());
    if (!hasEmail) {
      return res.status(404).json({ error: 'not found' });
    }
    return res.status(200).json({ incident: { id, ...data }, submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
