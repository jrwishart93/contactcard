import { useRouter } from 'next/router';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, collection } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/firebase/client';

export default function CrashReport() {
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Crash Report</h1>
          <p><span className="font-medium">Report Ref:</span> {id}</p>
          {incident.incidentDate && (
            <p><span className="font-medium">Date of Incident:</span> {new Date(incident.incidentDate).toLocaleDateString()}</p>
          )}
          {incident.officer && (
            <p><span className="font-medium">Officer:</span> {incident.officer}</p>
          )}
          {expiry && (
            <p className="text-sm text-gray-600 dark:text-gray-300">Report available until {expiry.toLocaleDateString()}</p>
          )}
        </div>

        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((s: any, idx: number) => (
              <div key={s.id} className="border p-4 rounded">
                <h2 className="font-semibold mb-2">Party {idx + 1}</h2>
                <p><strong>Name:</strong> {s.fullName}</p>
                {s.address && <p><strong>Address:</strong> {s.address}</p>}
                {s.vehicle && (
                  <p><strong>Vehicle:</strong> {s.vehicle.make} {s.vehicle.model} ({s.vehicle.colour}) - {s.vehicle.reg}</p>
                )}
                {s.insurance && (
                  <p><strong>Insurance:</strong> {s.insurance.company} - Policy {s.insurance.policyNumber}</p>
                )}
                {s.notes && <p className="mt-2"><strong>Officer Notes:</strong> {s.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>No party submissions yet.</p>
        )}

        <div className="flex space-x-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</button>
          {mailto && (
            <a href={mailto} className="px-4 py-2 bg-blue-600 text-white rounded">Send Email</a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
