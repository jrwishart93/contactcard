// components/RTCForm.js
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '@/firebase/client';

export default function RTCForm() {
  const [parties, setParties] = useState([{ driver: '', owner: '', insurance: '', email: '' }]);
  const [incident, setIncident] = useState('');
  const router = useRouter();

  const addParty = () => {
    if (parties.length < 5) {
      setParties([...parties, { driver: '', owner: '', insurance: '', email: '' }]);
    }
  };

  const handleChange = (i, field, value) => {
    const updated = [...parties];
    updated[i][field] = value;
    setParties(updated);
  };

  const submit = async e => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, 'rtc'), {
      parties,
      incident,
      created: serverTimestamp(),
    });
    await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docRef.id, parties }),
    });
    router.push(`/rtc/${docRef.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {parties.map((party, i) => (
        <div key={i} className="border p-4 rounded space-y-2">
          <h3 className="font-semibold">Party {i + 1}</h3>
          <input
            type="text"
            placeholder="Driver Name"
            value={party.driver}
            onChange={e => handleChange(i, 'driver', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Owner Name (optional)"
            value={party.owner}
            onChange={e => handleChange(i, 'owner', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Insurance Company"
            value={party.insurance}
            onChange={e => handleChange(i, 'insurance', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={party.email}
            onChange={e => handleChange(i, 'email', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      {parties.length < 5 && (
        <button type="button" onClick={addParty} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
          Add another party
        </button>
      )}
      <input
        type="text"
        placeholder="Police Incident Number (optional)"
        value={incident}
        onChange={e => setIncident(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
        Submit
      </button>
    </form>
  );
}
