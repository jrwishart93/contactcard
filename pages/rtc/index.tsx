import Link from 'next/link';
import Header from '@/components/Header';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase/client';

export default function RTCList() {
  const [snapshot] = useCollection(collection(db, 'rtc'));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl mb-4">RTC Reports</h1>
        {!snapshot && <p>Loading…</p>}
        {snapshot && (
          <ul className="space-y-2">
            {snapshot.docs.map(doc => (
              <li key={doc.id} className="border p-2 rounded">
                <Link href={`/rtc/${doc.id}`}>{doc.id}</Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
