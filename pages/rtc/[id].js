// pages/rtc/[id].js
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import Header from '@/components/Header';
import { db } from '@/firebase/client';
import QRCodeOverlay from '@/components/QRCodeOverlay';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

export default function RTCView() {
  const router = useRouter();
  const { id } = router.query;
  const docRef = id ? doc(db, 'rtc', id) : null;
  const [value] = useDocumentData(docRef);
  const [notes, setNotes] = useState('');

  const resendEmail = async () => {
    try {
      await fetch(`/api/resend?id=${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to resend email');
    }
  };

  const saveNotes = async () => {
    if (docRef) await updateDoc(docRef, { notes });
  };

  if (!value) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 space-y-4 max-w-3xl mx-auto">
        <h1 className="text-2xl">RTC Report</h1>
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <p className="text-xl font-semibold">Police Ref: {value.policeRef || 'N/A'}</p>
            {value.created && (
              <p className="text-gray-600">
                Incident Date:{' '}
                {new Date(value.created.seconds * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
          {value.parties?.map((p, i) => (
            <div key={i} className="border p-4 rounded space-y-1">
              <h3 className="font-semibold">Party {i + 1}</h3>
              <p>
                <span className="font-medium">Driver:</span> {p.driver}
              </p>
              {p.owner && (
                <p>
                  <span className="font-medium">Owner:</span> {p.owner}
                </p>
              )}
              <p>
                <span className="font-medium">Insurance:</span> {p.insurance}
              </p>
              {p.email && (
                <p>
                  <span className="font-medium">Email:</span> {p.email}
                </p>
              )}
            </div>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add notes"
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <button onClick={saveNotes} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Save</button>
          <button onClick={resendEmail} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Resend Email</button>
          <QRCodeOverlay url={router.asPath} />
        </div>
        <div className="mt-4">
          <iframe
            src={`https://www.google.com/maps?q=${value.location?.lat},${value.location?.lng}&z=14&output=embed`}
            className="w-full h-64 border"
            allowFullScreen
          />
        </div>
        <div className="hidden print:block mt-8">
          <QRCode value={router.asPath} size={128} />
        </div>
      </main>
    </div>
  );
}
