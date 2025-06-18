// pages/rtc/[id].js
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';
import QRCodeOverlay from '@/components/QRCodeOverlay';
import dynamic from 'next/dynamic';

// Pull off the default export so dynamic() gets a valid React component
const QRCode = dynamic(
  () => import('qrcode.react').then(mod => mod.default),
  { ssr: false }
);

export default function RTCView() {
  const router = useRouter();
  const { id } = router.query;
  const docRef = id ? doc(db, 'rtc', id) : null;
  const [value, loading, error] = useDocumentData(docRef);

  const resendEmail = async () => {
    try {
      await fetch(`/api/resend?id=${id}`, { method: 'POST' });
    } catch (err) {
      console.error(err);
      alert('Failed to resend email');
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-500">Error loading report.</p>;
  if (!value) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <main className="p-4 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl">RTC Report</h1>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-2">
          <p>
            <span className="font-medium">Date of Incident:</span>{' '}
            {value.incidentDate
              ? new Date(value.incidentDate).toLocaleDateString()
              : 'N/A'}
          </p>
          <p>
            <span className="font-medium">Ref:</span>{' '}
            {value.policeRef || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Vehicle Registration No.:</span>{' '}
            {value.vehicleReg}
          </p>
          <p>
            <span className="font-medium">Make/Model:</span>{' '}
            {value.makeModel}
          </p>
          <p>
            <span className="font-medium">Driver:</span>{' '}
            {value.driverName}
          </p>
          {value.ownerName && (
            <p>
              <span className="font-medium">Owner:</span>{' '}
              {value.ownerName}
            </p>
          )}
          <p>
            <span className="font-medium">Insurance Company:</span>{' '}
            {value.insuranceCompany}
          </p>
          {value.policyNo && (
            <p>
              <span className="font-medium">Policy No.:</span>{' '}
              {value.policyNo}
            </p>
          )}
          <p>
            <span className="font-medium">Injuries:</span>{' '}
            {value.injuries}
          </p>
          {value.injuries === 'Yes' && (
            <p className="italic">
              <span className="font-medium">Details:</span>{' '}
              {value.injuryDetails}
            </p>
          )}
          {value.officer && (
            <p>
              <span className="font-medium">Officer Dealing:</span>{' '}
              {value.officer}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={resendEmail}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Resend Email
          </button>
          <QRCodeOverlay url={router.asPath} />
        </div>

        <div className="hidden print:block mt-8">
          <QRCode value={router.asPath} size={128} />
        </div>
      </main>
    </div>
  );
}
