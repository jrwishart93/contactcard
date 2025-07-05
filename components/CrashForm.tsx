// components/CrashForm.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { serverTimestamp, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';

const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

export default function CrashForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    incidentDate: '',
    policeRef: '',
    vehicleReg: '',
    makeModel: '',
    driverName: '',
    ownerName: '',
    postcode: '',
    houseNumber: '',
    address: '',
    insuranceCompany: '',
    policyNo: '',
    location: '',
    lat: '',
    lng: '',
    locationNotes: '',
    injuries: 'No',
    injuryDetails: '',
    officer: '',
    email: '',
    contactNumber: '',
    isDriverOwner: 'Yes',
    ownerEmail: '',
    ownerContactNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const officers = [
    { value: 'T123 PC John Smith', label: 'T123 PC John Smith' },
    { value: 'T345 PC Jane Doe', label: 'T345 PC Jane Doe' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const lookupAddresses = async () => {
    const postcode = formData.postcode.trim();
    const house = formData.houseNumber.trim();
    if (!postcode) {
      alert('Please enter a postcode');
      return;
    }

    const tryFetch = async (path) => {
      console.log('Fetching', path);
      const res = await fetch(path);
      console.log('→ status', res.status);
      if (!res.ok) return null;
      const data = await res.json();
      console.log('→ data', data);
      return data.addresses && data.addresses.length ? data.addresses : null;
    };

    setAddressLoading(true);
    setAddresses([]);

    const encPost = encodeURIComponent(postcode);
    const encHouse = encodeURIComponent(house);

    let found =
      (await tryFetch(`/api/mapbox-address-lookup?postcode=${encPost}&house=${encHouse}`)) ||
      (await tryFetch(`/api/nominatim-address-lookup?postcode=${encPost}&house=${encHouse}`));

    if (found) {
      setAddresses(found);
    } else {
      alert('No addresses found — check postcode!');
    }

    setAddressLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const incidentId = `PS-${formData.incidentDate.replace(/-/g, '')}-${formData.policeRef}`;
      await setDoc(
        doc(db, 'rtc', incidentId),
        {
          ...formData,
          created: serverTimestamp(),
          expiresAt: Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        { merge: true }
      );
      // Send confirmation email
      const emailRes = await fetch('/api/submit', {
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
          locationNotes: formData.locationNotes,
          incidentDate: formData.incidentDate,
          policeRef: formData.policeRef,
          vehicle: { makeModel: formData.makeModel, reg: formData.vehicleReg },
          insurance: { company: formData.insuranceCompany, policyNumber: formData.policyNo },
        }),
      });
      if (!emailRes.ok) throw new Error('Email request failed');
      router.push(`/crash/${incidentId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-base">
      {/* Basic Details */}
      <h2 className="text-lg font-semibold">Basic Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date of Incident:</label>
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Ref:</label>
          <input
            type="text"
            name="policeRef"
            value={formData.policeRef}
            onChange={handleChange}
            pattern="\d{4}"
            maxLength={4}
            placeholder="If known"
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
      </div>

      {/* Location Picker */}
      <LocationPicker
        value={{
          location: formData.location,
          lat: formData.lat,
          lng: formData.lng,
          locationNotes: formData.locationNotes,
        }}
        onChange={(vals) => setFormData(prev => ({ ...prev, ...vals }))}
      />

      {/* Injuries */}
      <div>
        <label className="block font-medium">Injuries:</label>
        <div className="flex items-center space-x-4 mt-1">
          {['Yes', 'No'].map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name="injuries"
                value={opt}
                checked={formData.injuries === opt}
                onChange={handleChange}
                className="mr-1"
              />
              {opt}
            </label>
          ))}
        </div>
        {formData.injuries === 'Yes' && (
          <textarea
            name="injuryDetails"
            value={formData.injuryDetails}
            onChange={handleChange}
            placeholder="Brief details of injuries"
            className="mt-2 block w-full p-3 border rounded"
          />
        )}
      </div>

      {/* Vehicle Details */}
      <h2 className="text-lg font-semibold">Vehicle Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Registration No.:</label>
          <input
            type="text"
            name="vehicleReg"
            value={formData.vehicleReg}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded"
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
            className="mt-1 block w-full p-3 border rounded"
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
            className="mt-1 block w-full p-3 border rounded"
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
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
      </div>

      {/* Driver & Owner */}
      <h2 className="text-lg font-semibold">Driver Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Name of Driver:</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Is Driver the Owner?</label>
          <div className="mt-1 flex items-center space-x-4">
            {['Yes','No'].map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name="isDriverOwner"
                  value={opt}
                  checked={formData.isDriverOwner===opt}
                  onChange={handleChange}
                  className="mr-1"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>
      {formData.isDriverOwner==='No' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Name of Owner:</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="If different or company"
              className="mt-1 block w-full p-3 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Owner Email:</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Owner Contact No.:</label>
            <input
              type="tel"
              name="ownerContactNumber"
              value={formData.ownerContactNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded"
            />
          </div>
        </div>
      )}

      {/* Address Lookup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block font-medium" htmlFor="postcode">Postcode:</label>
          <input id="postcode" name="postcode" type="text" value={formData.postcode} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block font-medium" htmlFor="houseNumber">House No.:</label>
          <input id="houseNumber" name="houseNumber" type="text" value={formData.houseNumber} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <button type="button" onClick={lookupAddresses} className="px-4 py-2 bg-gray-200 rounded">{addressLoading? 'Searching…':'Find Address'}</button>
      </div>
      <div className="mb-4">
        <label className="block font-medium" htmlFor="address">Address</label>
        {addresses.length>0? (
          <select id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" required>
            <option value="">Select full address…</option>
            {addresses.map(addr=><option key={addr} value={addr}>{addr}</option>)}
          </select>
        ):(
          <input id="address" name="address" type="text" value={formData.address} disabled placeholder="Full address will appear here" className="mt-1 block w-full p-3 border rounded bg-gray-100 text-gray-500" />
        )}
      </div>

      {/* Contact & Officer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Contact No.:</label>
          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="mt-1 block w-full p-3 border rounded" />
        </div>
      </div>
      <h2 className="text-lg font-semibold">Officer Dealing</h2>
      <select name="officer" value={formData.officer} onChange={handleChange} className="mt-1 block w-full p-3 border rounded">
        <option value="">Select officer (if known)</option>
        {officers.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button type="submit" disabled={submitting} className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">{submitting? 'Saving...' : 'Submit Report'}</button>
    </form>
  );
}
