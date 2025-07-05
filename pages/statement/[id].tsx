import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';
import QRCodeOverlay from '@/components/QRCodeOverlay';
import dynamic from 'next/dynamic';

const QRCode: any = dynamic(() => import('qrcode.react').then(m => m.default as any), { ssr: false });

export default function StatementView() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;
  const docRef = docId ? doc(db, 'statements', docId) : null;
  const [value, loading, error] = useDocumentData(docRef);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-500">Error loading statement.</p>;
  if (!value) return null;

  const created = value.created?.toDate ? value.created.toDate() : null;
  const mailtoLink = typeof window !== 'undefined'
    ? `mailto:?subject=Statement%20${docId}&body=${encodeURIComponent(location.href)}`
    : '#';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl">Statement {docId}</h1>
        {created && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Created {created.toLocaleString()}
          </p>
        )}
        <pre className="whitespace-pre-wrap p-4 rounded bg-gray-100 dark:bg-gray-800">
          {value.text}
        </pre>
        <div className="flex space-x-2">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            Print
          </button>
          <button disabled className="px-4 py-2 rounded-full bg-gray-300 text-gray-700">
            PDF (coming soon)
          </button>
          <a href={mailtoLink} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            Resend Email
          </a>
          <QRCodeOverlay url={router.asPath} />
        </div>

        <div className="hidden print:block mt-8">
          <QRCode value={router.asPath} size={128} />
        </div>
      </main>
    </div>
  );
}
