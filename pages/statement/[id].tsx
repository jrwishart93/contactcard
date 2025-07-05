import { useRouter } from 'next/router';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';

export default function StatementView() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;
  const docRef = docId ? doc(db, 'statements', docId) : null;
  const [value, loading, error] = useDocumentData(docRef);

  if (!id) return null;
  if (loading) return <p className="p-4">Loading…</p>;
  if (error || !value) return <p className="p-4">Statement not found.</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Statement {id}</h1>
        <pre className="whitespace-pre-wrap p-4 border rounded bg-gray-100 dark:bg-gray-800">
          {value.text}
        </pre>
      </main>
    </div>
  );
}
