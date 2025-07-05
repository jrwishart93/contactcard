// pages/statement/[id].js
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/firebase/client';

export default function StatementView() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;

  const docRef = docId ? doc(db, 'statements', docId) : null;
  const [statement, loading, error] = useDocumentData(docRef);

  if (!id) return null;
  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-500">Error loading statement.</p>;
  if (!statement) return <p className="p-4">Statement not found.</p>;

  const mailto = statement.email
    ? `mailto:${statement.email}?subject=Statement%20${docId}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Statement</h1>
          <p><span className="font-medium">Ref:</span> {id}</p>
          {statement.created && (
            <p>
              <span className="font-medium">Created:</span>{' '}
              {new Date(
                statement.created.seconds * 1000
              ).toLocaleString()}
            </p>
          )}
        </div>

        {statement.text && (
          <pre className="whitespace-pre-wrap border p-4 rounded bg-gray-100 dark:bg-gray-800">
            {statement.text}
          </pre>
        )}

        <div className="flex space-x-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">
            Print
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">
            Download PDF
          </button>
          {mailto && (
            <a href={mailto} className="px-4 py-2 bg-blue-600 text-white rounded">
              Send Email
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}