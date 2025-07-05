import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const cleanupExpiredReports = functions
  .pubsub.schedule('every 24 hours')
  .onRun(async (_context): Promise<null> => {
  const db = admin.firestore();
  const now = Date.now();
  const snapshot = await db.collection('rtc').get();

  const batch = db.batch();
  const deletedIds: string[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const expiresAt = data.expiresAt;
    const expiresMillis: number | undefined =
      expiresAt && typeof (expiresAt as any).toMillis === 'function'
        ? (expiresAt as any).toMillis()
        : (expiresAt as number | undefined);
    if (!expiresMillis || expiresMillis > now) {
      continue;
    }

    const subSnap = await doc.ref.collection('submissions').get();
    subSnap.forEach(subDoc => batch.delete(subDoc.ref));
    batch.delete(doc.ref);
    deletedIds.push(doc.id);
  }

  if (!deletedIds.length) {
    return null;
  }

  await batch.commit();

  await db.collection('audit').add({
    action: 'cleanupExpiredReports',
    deleted: deletedIds,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return null;
  });
