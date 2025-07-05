import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import validateConfig from '../../firebase/validateConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  validateConfig();
  if (!getApps().length) initializeApp(firebaseConfig);
  const db = getFirestore();
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { id } = req.query; // incident number
  const docId = Array.isArray(id) ? id[0] : id;
  const { officerEmail } = req.body || {};

  try {
    const snap = await getDocs(collection(db, 'rtc', docId, 'submissions'));
    const submissions = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

    if (!submissions.length) return res.status(404).json({ error: 'No submissions' });

    const emails = submissions.map(s => s.email);
    if (officerEmail) emails.push(officerEmail);

    const html = generateSummaryTemplate(docId, submissions);

    await resend.emails.send({
      from: 'Police Scotland <noreply@resend.dev>',
      to: emails,
      subject: `Crash Report Summary - ${id}`,
      html
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

function generateSummaryTemplate(incidentNumber: string, submissions: any[]): string {
  const parties = submissions
    .map((s, idx) => {
      const vehicle = s.vehicle || {};
      const insurance = s.insurance || {};
      return `
      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0;">Party ${idx + 1}</h3>
        <p><strong>Name:</strong> ${s.fullName}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        ${s.phone ? `<p><strong>Phone:</strong> ${s.phone}</p>` : ''}
        <p><strong>Vehicle:</strong> ${vehicle.make || ''} ${vehicle.model || ''} (${vehicle.colour || ''}) - ${vehicle.reg || ''}</p>
        <p><strong>Insurance:</strong> ${insurance.company || ''} - Policy ${insurance.policyNumber || ''}</p>
        <p><strong>Constable:</strong> ${s.constable || ''}</p>
        <p><strong>Location:</strong> ${s.location || ''}</p>
      </div>`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Crash Report Summary</title>
        <style>
          body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f5f5f5; margin:0; padding:20px; }
          .container { max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:8px; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
          h1 { font-size:20px; margin-bottom:20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Crash Report Summary - ${incidentNumber}</h1>
          ${parties}
        </div>
      </body>
    </html>
  `;
}
