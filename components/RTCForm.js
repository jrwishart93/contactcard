import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
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
    location: '',
    lat: '',
    lng: '',
    injuries: 'No',
    injuryDetails: '',
    officer: '',
    email: '',
    contactNumber: '',
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

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        }));
      },
      () => alert('Unable to retrieve your location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const incidentId = `PS-${formData.incidentDate.replace(/-/g, '')}-${formData.policeRef}`;
      await setDoc(doc(db, 'rtc', incidentId), {
        ...formData,
        created: serverTimestamp(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }, { merge: true });
      // Send confirmation email using API route, but don't block form submission
      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentNumber: incidentId,
          userId: incidentId,
          fullName: formData.driverName,
          email: formData.email,
          phone: formData.contactNumber,
          constable: formData.officer,
          location: formData.location,
          incidentDate: formData.incidentDate,
          policeRef: formData.policeRef,
          vehicle: {
            makeModel: formData.makeModel,
            reg: formData.vehicleReg,
          },
          insurance: {
            company: formData.insuranceCompany,
            policyNumber: formData.policyNo,
          },
        }),
      }).catch((err) => {
        console.error('Failed to send confirmation email', err);
      });
      router.push(`/rtc/${incidentId}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create report');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-base">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date of Incident:</label>
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
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
            className="mt-1 block w-full p-3 border rounded text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block font-medium">Location of Collision:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter street or area"
            className="mt-1 block w-full p-3 border rounded text-base"
          />
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          className="px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-base"
        >
          Use My Location
        </button>
      </div>
      {formData.lat && formData.lng && (
        <div className="mt-2">
          <iframe
            title="map"
            width="100%"
            height="300"
            className="border rounded"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.lng - 0.005},${formData.lat - 0.005},${formData.lng + 0.005},${formData.lat + 0.005}&layer=mapnik&marker=${formData.lat},${formData.lng}`}
          />
          <p className="text-sm mt-1">
            <a
              href={`https://www.openstreetmap.org/?mlat=${formData.lat}&mlon=${formData.lng}#map=18/${formData.lat}/${formData.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on OpenStreetMap
            </a>
          </p>
        </div>
      )}

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
            className="mt-2 block w-full p-3 border rounded text-base"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Officer Dealing:</label>
        <select
          name="officer"
          value={formData.officer}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border rounded text-base"
        >
          <option value="">Select officer (if known)</option>
          {officers.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded text-base"
          />
        </div>
        <div>
          <label className="block font-medium">Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Optional"
            className="mt-1 block w-full p-3 border rounded text-base"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-base"
      >
        {submitting ? 'Saving...' : 'Submit Report'}
      </button>
    </form>
  );
}
