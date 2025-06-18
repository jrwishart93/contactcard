import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function ViewReport() {
  const router = useRouter();
  const [form, setForm] = useState({
    stormRef: '',
    dateOfIncident: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const { ref, date } = router.query;
    setForm(prev => ({
      ...prev,
      stormRef: typeof ref === 'string' ? ref : prev.stormRef,
      dateOfIncident: typeof date === 'string' ? date : prev.dateOfIncident,
    }));
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(form.stormRef)) {
      setError('Storm Ref must be 4 digits');
      return;
    }
    setError('');
    setLoading(true);
    setReport(null);
    try {
      const q = query(
        collection(db, 'rtc'),
        where('policeRef', '==', form.stormRef),
        where('incidentDate', '==', form.dateOfIncident)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('No report found for that Storm Ref, date, and email combination.');
        setLoading(false);
        return;
      }
      const docSnap = snap.docs[0];
      const data = docSnap.data();
      if (data.expiresAt && data.expiresAt.toDate() <= new Date()) {
        setError('No report found for that Storm Ref, date, and email combination.');
        setLoading(false);
        return;
      }
      const subsSnap = await getDocs(collection(db, 'rtc', docSnap.id, 'submissions'));
      const submissions = subsSnap.docs.map(d => d.data());
      const hasEmail = submissions.some(s =>
        s.email && s.email.toLowerCase() === form.email.toLowerCase()
      );
      if (!hasEmail) {
        setError('No report found for that Storm Ref, date, and email combination.');
        setLoading(false);
        return;
      }
      setReport({ id: docSnap.id, ...data, submissions });
    } catch (err) {
      console.error(err);
      setError('Failed to lookup report');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow p-4 md:p-8 max-w-md mx-auto space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">View Crash Report</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-base">
          <div>
            <label className="block font-medium">Storm Ref</label>
            <input
              type="text"
              name="stormRef"
              value={form.stormRef}
              onChange={handleChange}
              pattern="\d{4}"
              required
              maxLength={4}
              className="mt-1 block w-full p-3 border rounded text-base"
            />
          </div>
          <div>
            <label className="block font-medium">Date of Incident</label>
            <input
              type="date"
              name="dateOfIncident"
              value={form.dateOfIncident}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border rounded text-base"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border rounded text-base"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded text-base">
            Submit
          </button>
        </form>
        {loading && <p>Loading…</p>}
        {report && (
          <div className="mt-4 space-y-2 text-sm">
            <h2 className="text-lg font-medium">Crash Report {report.id}</h2>
            <p>
              <span className="font-medium">Date:</span>{' '}
              {report.incidentDate}
            </p>
            <p>
              <span className="font-medium">Ref:</span> {report.policeRef}
            </p>
            {report.submissions && (
              <div className="mt-2">
                <h3 className="font-medium">Submissions</h3>
                <ul className="list-disc list-inside">
                  {report.submissions.map((s, idx) => (
                    <li key={idx}>{s.fullName || s.email}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
