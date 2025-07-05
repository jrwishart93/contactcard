// pages/crash/[id].js
import { useRouter } from 'next/router';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, collection } from 'firebase/firestore';
import Header from '@/components/Header';
import { db } from '@/firebase/client';
import QRCodeOverlay from '@/components/QRCodeOverlay';
import dynamic from 'next/dynamic';

// Pull off the default export so dynamic() gets a valid React component
const QRCode: any = dynamic(
  () => import('qrcode.react').then(mod => mod.default as any),
  { ssr: false }
);

export default function CrashView() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;
  const docRef = docId ? doc(db, 'rtc', docId) : null;
  const [value, loading, error] = useDocumentData(docRef);
  const submissionsRef = docId ? collection(db, 'rtc', docId, 'submissions') : null;
  const [submissions, subsLoading, subsError] = useCollectionData(submissionsRef, { idField: 'id' });

  const resendEmail = async () => {
    try {
      await fetch(`/api/resend?id=${id}`, { method: 'POST' });
    } catch (err) {
      console.error(err);
      alert('Failed to resend email');
    }
  };

  if (loading || subsLoading) return <p className="p-4">Loading…</p>;
  if (error || subsError) return <p className="p-4 text-red-500">Error loading report.</p>;
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
          {value.address && (
            <p>
              <span className="font-medium">Address:</span>{' '}
              {value.address}
            </p>
          )}
          {value.ownerName && (
            <p>
              <span className="font-medium">Owner:</span>{' '}
              {value.ownerName}
            </p>
          )}
          {(value.ownerEmail || value.ownerContactNumber) && (
            <div className="space-y-1">
              <p className="font-medium">Owner Contact:</p>
              {value.ownerEmail && <p>{value.ownerEmail}</p>}
              {value.ownerContactNumber && <p>{value.ownerContactNumber}</p>}
            </div>
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
        {value.location && (
          <p>
            <span className="font-medium">Location:</span>{' '}
            {value.location}
          </p>
        )}
        {value.locationNotes && (
          <p>
            <span className="font-medium">Location Notes:</span>{' '}
            {value.locationNotes}
          </p>
        )}
        {value.lat && value.lng && (
          <div className="mt-2">
            <iframe
              title="map"
              width="100%"
              height="300"
              className="border rounded"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${value.lng - 0.005},${value.lat - 0.005},${value.lng + 0.005},${value.lat + 0.005}&layer=mapnik&marker=${value.lat},${value.lng}`}
            />
            <p className="text-sm mt-1">
              <a
                href={`https://www.openstreetmap.org/?mlat=${value.lat}&mlon=${value.lng}#map=18/${value.lat}/${value.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on OpenStreetMap
              </a>
            </p>
          </div>
        )}
        {value.officer && (
          <p>
            <span className="font-medium">Officer Dealing:</span>{' '}
            {value.officer}
          </p>
        )}
        </div>

        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((s, idx) => {
              const vehicle = s.vehicle || {};
              const insurance = s.insurance || {};
              return (
                <div key={s.id} className="border p-4 rounded">
                  <h2 className="font-semibold mb-2">Party {idx + 1}</h2>
                  <p>
                    <strong>Name:</strong> {s.fullName}
                  </p>
                  {s.email && (
                    <p>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${s.email}`} className="text-blue-600 underline">
                        {s.email}
                      </a>
                    </p>
                  )}
                  {s.phone && (
                    <p>
                      <strong>Phone:</strong> {s.phone}
                    </p>
                  )}
                  <p>
                    <strong>Vehicle:</strong> {vehicle.make || ''} {vehicle.model || ''}{' '}
                    {vehicle.colour ? `(${vehicle.colour})` : ''} - {vehicle.reg || ''}
                  </p>
                  <p>
                    <strong>Insurance:</strong> {insurance.company || ''} - Policy{' '}
                    {insurance.policyNumber || ''}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No party submissions yet.</p>
        )}

        <div className="flex space-x-2">
          <button
            onClick={resendEmail}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Resend Email
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Print
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300">
            Download PDF
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
