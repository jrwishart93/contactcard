import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function CrashSearchForm() {
  const [date, setDate] = useState('');
  const [stormRef, setStormRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const yyyymmdd = date.replace(/-/g, '');
      const key = `PS-${yyyymmdd}-${stormRef}`;
      const snap = await getDoc(doc(db, 'crashReports', key));
      if (snap.exists()) {
        setResult({ id: snap.id, ...snap.data() });
      } else {
        setError('Report not found');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching report');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium">STORM Ref</label>
        <input
          type="text"
          value={stormRef}
          onChange={(e) => setStormRef(e.target.value)}
          required
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? 'Searching...' : 'Find Report'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <pre className="p-2 bg-gray-100 rounded overflow-x-auto">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
}
