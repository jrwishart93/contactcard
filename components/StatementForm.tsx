import { useState } from 'react';
import Handlebars from 'handlebars';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function StatementForm() {
  const [formData, setFormData] = useState({
    date: '',
    officer: '',
    name: '',
    address: '',
    dob: '',
    location: '',
    lat: '',
    lng: '',
    description: '',
    declaration: false,
  });
  const [otherParties, setOtherParties] = useState([{ name: '', contact: '' }]);
  const [witnesses, setWitnesses] = useState([{ name: '', statement: '' }]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({ ...prev, lat: latitude.toFixed(6), lng: longitude.toFixed(6) }));
      },
      () => alert('Unable to retrieve location')
    );
  };

  const addOtherParty = () => setOtherParties((p) => [...p, { name: '', contact: '' }]);
  const addWitness = () => setWitnesses((w) => [...w, { name: '', statement: '' }]);

  const handleOtherChange = (idx, field, value) => {
    setOtherParties((p) => p.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  };
  const handleWitnessChange = (idx, field, value) => {
    setWitnesses((w) => w.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  };

  const generate = async () => {
    setLoading(true);
    const tmplEl = document.getElementById('statement-template');
    let text = '';
    if (tmplEl) {
      const template = Handlebars.compile(tmplEl.innerHTML);
      text = template({ ...formData, otherParties, witnesses });
    } else {
      try {
        const res = await fetch('/api/generate-statement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, otherParties, witnesses }),
        });
        const data = await res.json();
        text = data.text || '';
      } catch (err) {
        console.error(err);
        text = 'Failed to generate statement';
      }
    }
    try {
      const docRef = await addDoc(collection(db, 'statements'), {
        ...formData,
        otherParties,
        witnesses,
        text,
        created: serverTimestamp(),
      });
      setOutput(text);
      router.push(`/statement/${docRef.id}`);
    } catch (err) {
      console.error(err);
      setOutput('Failed to save statement');
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 text-base" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-lg font-semibold">Statement Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Officer</label>
          <input type="text" name="officer" value={formData.officer} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
      </div>
      <div>
        <label className="block font-medium">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
      </div>
      <div>
        <label className="block font-medium">Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
      </div>
      <div>
        <label className="block font-medium">Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block font-medium">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
        <button type="button" onClick={handleUseLocation} className="px-6 py-3 rounded-full bg-gray-200">Use My Location</button>
      </div>
      {formData.lat && formData.lng && (
        <div className="mt-2">
          <iframe
            title="map"
            width="100%"
            height="300"
            className="border rounded"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.lng) - 0.005},${parseFloat(formData.lat) - 0.005},${parseFloat(formData.lng) + 0.005},${parseFloat(formData.lat) + 0.005}&layer=mapnik&marker=${formData.lat},${formData.lng}`}
          />
        </div>
      )}
      <div>
        <label className="block font-medium">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
      </div>
      <div>
        <h3 className="font-semibold">Other Parties</h3>
        {otherParties.map((p, idx) => (
          <div key={idx} className="border p-2 mb-2">
            <label className="block text-sm font-medium">
              Name
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleOtherChange(idx, 'name', e.target.value)}
                className="mt-1 block w-full p-2 border rounded mb-2"
              />
            </label>
            <label className="block text-sm font-medium">
              Contact
              <input
                type="text"
                value={p.contact}
                onChange={(e) => handleOtherChange(idx, 'contact', e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addOtherParty} className="px-4 py-2 bg-gray-200 rounded">Add Party</button>
      </div>
      <div>
        <h3 className="font-semibold">Witness Information</h3>
        {witnesses.map((w, idx) => (
          <div key={idx} className="border p-2 mb-2">
            <label className="block text-sm font-medium">
              Name
              <input
                type="text"
                value={w.name}
                onChange={(e) => handleWitnessChange(idx, 'name', e.target.value)}
                className="mt-1 block w-full p-2 border rounded mb-2"
              />
            </label>
            <label className="block text-sm font-medium">
              Statement
              <textarea
                value={w.statement}
                onChange={(e) => handleWitnessChange(idx, 'statement', e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addWitness} className="px-4 py-2 bg-gray-200 rounded">Add Witness</button>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} className="mr-2" />
          I confirm the above is accurate
        </label>
      </div>
      <button type="button" disabled={!formData.declaration || loading} onClick={generate} className="px-6 py-3 rounded-full bg-blue-600 text-white">
        {loading ? 'Generating...' : 'Generate Statement'}
      </button>
      {output && (
        <pre id="output" className="mt-4 whitespace-pre-wrap p-4 border rounded bg-gray-100 dark:bg-gray-800">
          {output}
        </pre>
      )}
    </form>
  );
}
