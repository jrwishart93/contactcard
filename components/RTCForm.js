import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { serverTimestamp, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';

const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

export default function RTCForm() {
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
    if (!formData.postcode) return;
    setAddressLoading(true);
    setAddresses([]);
    try {
      const res = await fetch(
        `/api/address-lookup?postcode=${encodeURIComponent(formData.postcode)}&house=${encodeURIComponent(formData.houseNumber)}`
      );
      if (!res.ok) throw new Error('Address lookup failed');
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error(err);
      alert('Address lookup failed');
    } finally {
      setAddressLoading(false);
    }
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
          expiresAt: Timestamp.fromMillis(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
        { merge: true }
      );

      try {
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
            vehicle: {
              makeModel: formData.makeModel,
              reg: formData.vehicleReg,
            },
            insurance: {
              company: formData.insuranceCompany,
              policyNumber: formData.policyNo,
            },
          }),
        });
        if (!emailRes.ok) {
          throw new Error('Email request failed');
        }
      } catch (err) {
        console.error('Failed to send confirmation email', err);
        alert('Failed to send confirmation email');
      }

      router.push(`/rtc/${incidentId}`);
    } catch (error) {
      console.error('Error adding document:', error);
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
          {['Yes', 'No'].map(option => (
            <label key={option}>
              <input
                type="radio"
                name="injuries"
                value={option}
                checked={formData.injuries === option}
                onChange={handleChange}
                className="mr-1"
              />
              {option}
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

      {/* Driver & Owner Details */}
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
            {['Yes', 'No'].map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="isDriverOwner"
                  value={option}
                  checked={formData.isDriverOwner === option}
                  onChange={handleChange}
                  className="mr-1"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
      {formData.isDriverOwner === 'No' && (
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
          <label className="block font-medium">Postcode:</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">House No.:</label>
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <button
          type="button"
          onClick={lookupAddresses}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          {addressLoading ? 'Searching...' : 'Find Address'}
        </button>
        {addresses.length > 0 && (
          <select
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="p-3 border rounded"
          >
            <option value="">Select address</option>
            {addresses.map(addr => (
              <option key={addr} value={addr}>{addr}</option>
            ))}
          </select>
        )}
      </div>

      {/* Contact & Officer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Contact No.:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border rounded"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold">Officer Dealing</h2>
      <select
        name="officer"
        value={formData.officer}
        onChange={handleChange}
        className="mt-1 block w-full p-3 border rounded"
      >
        <option value="">Select officer (if known)</option>
        {officers.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {submitting ? 'Saving...' : 'Submit Report'}
      </button>
    </form>
  );
}
