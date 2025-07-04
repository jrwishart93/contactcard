const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.cleanupExpiredReports = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  const now = Date.now();
  const snapshot = await db.collection('rtc').get();

  const batch = db.batch();
  const deletedIds = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const expiresAt = data.expiresAt;
    const expiresMillis =
      expiresAt && typeof expiresAt.toMillis === 'function'
        ? expiresAt.toMillis()
        : expiresAt;
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
