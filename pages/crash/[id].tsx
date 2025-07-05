// pages/crash/[id].js
import { useRouter } from 'next/router';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, collection } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCodeOverlay from '@/components/QRCodeOverlay';
import dynamic from 'next/dynamic';
import { db } from '@/firebase/client';

const QRCode = dynamic(() => import('qrcode.react').then(mod => mod.default), { ssr: false });

export default function CrashReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const docId = Array.isArray(id) ? id[0] : id;

  const docRef = docId ? doc(db, 'rtc', docId) : null;
  const submissionsRef = docId ? collection(db, 'rtc', docId, 'submissions') : null;

  const [incident, incidentLoading] = useDocumentData(docRef);
  const [submissions, subsLoading] = useCollectionData(submissionsRef, { idField: 'id' });

  if (!id) return null;
  if (incidentLoading || subsLoading) return <p className="p-4">Loading…</p>;
  if (!incident) return <p className="p-4">Report not found.</p>;

  const created = incident.created?.toDate ? incident.created.toDate() : null;
  const expiry = created ? new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const mailto = incident.email ? `mailto:${incident.email}?subject=Crash%20Report%20${docId}` : null;

  const resendEmail = async () => {
    try {
      await fetch(`/api/resend?id=${id}`, { method: 'POST' });
    } catch (err) {
      console.error(err);
      alert('Failed to resend email');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Crash Report</h1>
        <div className="space-y-2 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p><strong>Report Ref:</strong> {id}</p>
          {incident.incidentDate && (
            <p><strong>Date of Incident:</strong> {new Date(incident.incidentDate).toLocaleDateString()}</p>
          )}
          {incident.policeRef && <p><strong>Police Ref:</strong> {incident.policeRef}</p>}
          {incident.officer && <p><strong>Officer Dealing:</strong> {incident.officer}</p>}
          {expiry && <p className="text-sm text-gray-500">Available until {expiry.toLocaleDateString()}</p>}
          {incident.location && <p><strong>Location:</strong> {incident.location}</p>}
          {incident.locationNotes && <p><strong>Location Notes:</strong> {incident.locationNotes}</p>}
          {incident.lat && incident.lng && (
            <div className="mt-2">
              <iframe
                title="Map"
                width="100%"
                height="300"
                className="border rounded"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${incident.lng - 0.005},${incident.lat - 0.005},${incident.lng + 0.005},${incident.lat + 0.005}&layer=mapnik&marker=${incident.lat},${incident.lng}`}
              />
              <p className="text-sm mt-1">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${incident.lat}&mlon=${incident.lng}#map=18/${incident.lat}/${incident.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on OpenStreetMap
                </a>
              </p>
            </div>
          )}
        </div>

        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((s, idx) => (
              <div key={s.id} className="border p-4 rounded bg-white dark:bg-gray-900">
                <h2 className="font-semibold mb-2">Party {idx + 1}</h2>
                <p><strong>Name:</strong> {s.fullName}</p>
                {s.address && <p><strong>Address:</strong> {s.address}</p>}
                {s.vehicle && (
                  <p><strong>Vehicle:</strong> {s.vehicle.make} {s.vehicle.model} ({s.vehicle.colour}) - {s.vehicle.reg}</p>
                )}
                {s.insurance && (
                  <p><strong>Insurance:</strong> {s.insurance.company} - Policy {s.insurance.policyNumber}</p>
                )}
                {s.notes && <p><strong>Officer Notes:</strong> {s.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>No party submissions yet.</p>
        )}

        <div className="flex space-x-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</button>
          {mailto && <a href={mailto} className="px-4 py-2 bg-blue-600 text-white rounded">Send Email</a>}
          <button onClick={resendEmail} className="px-4 py-2 bg-blue-500 text-white rounded">Resend Email</button>
          <QRCodeOverlay url={router.asPath} />
        </div>

        <div className="hidden print:block mt-8">
          <QRCode value={router.asPath} size={128} />
        </div>
      </main>
      <Footer />
    </div>
  );
}