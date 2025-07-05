// @ts-nocheck
import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase/client';
import Header from '@/components/Header';
import AuthCheck from '@/components/AuthCheck';

function IncidentRow({ id }) {
  const submissionsRef = collection(db, 'rtc', id, 'submissions');
  const [submissions] = useCollectionData(submissionsRef, { idField: 'id' });
  const [expanded, setExpanded] = useState(false);

  const saveSubmission = async (sub) => {
    const { id: subId, ...data } = sub;
    await updateDoc(doc(db, 'rtc', id, 'submissions', subId), data);
  };

  const sendSummary = async () => {
    await fetch(`/api/final-summary?id=${id}`, { method: 'POST' });
  };

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Incident {id}</h2>
        <div className="space-x-2">
          <span>{submissions ? submissions.length : 0}/5 submissions</span>
          <button onClick={() => setExpanded(!expanded)} className="px-2 py-1 bg-gray-200 rounded">
            {expanded ? 'Hide' : 'View'}
          </button>
          <button onClick={sendSummary} className="px-2 py-1 bg-blue-600 text-white rounded">
            Send Final Summary Email
          </button>
        </div>
      </div>
      {expanded && submissions && (
        <div className="mt-4 space-y-4">
          {submissions.map(sub => (
            <SubmissionForm key={sub.id} incidentId={id} submission={sub} onSave={saveSubmission} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionForm({ incidentId, submission, onSave }) {
  const [form, setForm] = useState(submission);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 border rounded space-y-2">
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full p-1 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="w-full p-1 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Constable</label>
        <input name="constable" value={form.constable} onChange={handleChange} className="w-full p-1 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input name="location" value={form.location} onChange={handleChange} className="w-full p-1 border rounded" />
      </div>
      <button type="submit" className="px-2 py-1 bg-green-600 text-white rounded">Save</button>
    </form>
  );
}

export default function AdminPage() {
  const [incidentsSnapshot] = useCollection(collection(db, 'rtc'));
  if (!incidentsSnapshot) {
    return <p className="p-4">Loading…</p>;
  }
  return (
    <AuthCheck>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Header />
        <main className="p-4 max-w-3xl mx-auto">
          <h1 className="text-2xl mb-4">RTC Admin</h1>
          {incidentsSnapshot.docs.map(docSnap => (
            <IncidentRow key={docSnap.id} id={docSnap.id} />
          ))}
        </main>
      </div>
    </AuthCheck>
  );
}
