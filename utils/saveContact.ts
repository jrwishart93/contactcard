// utils/saveContact.js
import { collection, addDoc, type DocumentReference } from 'firebase/firestore';
import { db } from '../firebase/client';

export async function saveContact(data: Record<string, unknown>): Promise<DocumentReference | undefined> {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), data);
    console.log('Contact saved with ID:', docRef.id);
    return docRef;
  } catch (err) {
    console.error('Failed to save contact', err);
  }
}

