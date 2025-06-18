import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function RTCForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    incidentDate: '',
    policeRef: '',
    vehicleReg: '',
    makeModel: '',
    driverName: '',
    ownerName: '',
    insuranceCompany: '',
    policyNo: '',
    injuries: 'No',
    injuryDetails: '',
    officer: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const officers = [
    { value: 'T329 PC Wishart', label: 'T329 PC Wishart' },
    { value: 'T159 PC Niven', label: 'T159 PC Niven' },
    { value: 'T123 PC Example1', label: 'T123 PC Example1' },
    { value: 'T456 PC Example2', label: 'T456 PC Example2' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'rtc'), {
        ...formData,
        created: serverTimestamp(),
      });
      router.push(`/rtc/${docRef.id}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create report');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date of Incident:</label>
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Ref:</label>
          <input
            type="text"
            name="policeRef"
            value={formData.policeRef}
            onChange={handleChange}
            placeholder="If known"
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Vehicle Registration No.:</label>
          <input
            type="text"
            name="vehicleReg"
            value={formData.vehicleReg}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Make/Model:</label>
          <input
            type="text"
            name="makeModel"
            value={formData.makeModel}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Name of Driver:</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Name of Owner:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="If different or company"
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Insurance Company:</label>
          <input
            type="text"
            name="insuranceCompany"
            value={formData.insuranceCompany}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Policy No.:</label>
          <input
            type="text"
            name="policyNo"
            value={formData.policyNo}
            onChange={handleChange}
            placeholder="If known"
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Injuries:</label>
        <div className="flex items-center space-x-4 mt-1">
          <label>
            <input
              type="radio"
              name="injuries"
              value="Yes"
              checked={formData.injuries === 'Yes'}
              onChange={handleChange}
              className="mr-1"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="injuries"
              value="No"
              checked={formData.injuries === 'No'}
              onChange={handleChange}
              className="mr-1"
            />
            No
          </label>
        </div>
        {formData.injuries === 'Yes' && (
          <textarea
            name="injuryDetails"
            value={formData.injuryDetails}
            onChange={handleChange}
            placeholder="Brief details of injuries"
            className="mt-2 block w-full p-2 border rounded"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Officer Dealing:</label>
        <select
          name="officer"
          value={formData.officer}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded"
        >
          <option value="">Select officer (if known)</option>
          {officers.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {submitting ? 'Saving...' : 'Submit Report'}
      </button>
    </form>
  );
}
