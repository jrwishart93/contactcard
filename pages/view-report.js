import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ViewReport() {
  const [form, setForm] = useState({
    stormRef: '',
    dateOfIncident: '',
    email: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(form.stormRef)) {
      setError('Storm Ref must be 4 digits');
      return;
    }
    setError('');
    // TODO: handle search
    console.log('submit', form);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow p-4 max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">View Crash Report</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full p-2 border rounded"
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
              className="mt-1 block w-full p-2 border rounded"
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
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
