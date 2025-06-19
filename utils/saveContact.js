// utils/saveContact.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function saveContact(data) {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), data);
    console.log('Contact saved with ID:', docRef.id);
    return docRef;
  } catch (err) {
    console.error('Failed to save contact', err);
  }
}

