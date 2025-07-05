import { useState } from 'react';

export default function ReportLookupForm() {
  const [form, setForm] = useState({ policeRef: '', incidentDate: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);
    try {
      const res = await fetch('/api/report-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('not found');
      }
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      setError('No matching report found, or your email address does not match our records.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-base">
      <div>
        <label className="block font-medium">Police Ref Number</label>
        <input
          type="text"
          name="policeRef"
          value={form.policeRef}
          onChange={handleChange}
          pattern="\\d{4}"
          required
          className="mt-1 block w-full p-3 border rounded text-base"
        />
      </div>
      <div>
        <label className="block font-medium">Date of Incident</label>
        <input
          type="date"
          name="incidentDate"
          value={form.incidentDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-3 border rounded text-base"
        />
      </div>
      <div>
        <label className="block font-medium">Email Address</label>
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
      <button type="submit" disabled={loading} className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-base">
        {loading ? 'Searching...' : 'Search Report'}
      </button>
      {report && (
        <pre className="p-2 bg-gray-100 rounded overflow-x-auto text-sm mt-4">
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </form>
  );
}
