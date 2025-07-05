import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';
import AuthCheck from '@/components/AuthCheck';

export default function ReportList() {
  const [snap] = useCollection(collection(db, 'rtc'));
  return (
    <AuthCheck>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Header />
        <main className="p-4 max-w-3xl mx-auto space-y-2">
          <h1 className="text-2xl mb-4">All Reports</h1>
          {!snap && <p>Loading…</p>}
          {snap && (
            <ul className="space-y-1 list-disc list-inside">
              {snap.docs.map(doc => (
                <li key={doc.id}>{doc.id}</li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </AuthCheck>
  );
}
