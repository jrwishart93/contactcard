import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';

export default function StatementView() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;
  const docRef = docId ? doc(db, 'statements', docId) : null;
  const [value, loading, error] = useDocumentData(docRef);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-500">Error loading statement.</p>;
  if (!value) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl">Statement {docId}</h1>
        <pre className="whitespace-pre-wrap p-4 rounded bg-gray-100 dark:bg-gray-800">
          {value.text}
        </pre>
      </main>
    </div>
  );
}
