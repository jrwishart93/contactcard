import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

  const {
    incidentNumber,
    userId,
    fullName,
    email,
    constable,
    location,
    locationNotes,
    vehicle,
    insurance,
    incidentDate,
    policeRef,
    phone,
  } = req.body;

  try {
    await setDoc(doc(db, 'rtc', incidentNumber, 'submissions', userId), {
      fullName,
      email,
      constable,
      location,
      locationNotes,
      vehicle,
      insurance,
      incidentDate,
      policeRef,
      phone,
      submittedAt: new Date(),
    });

    const html = generateInitialEmailTemplate({
      fullName,
      email,
      constable,
      location,
      locationNotes,
      incidentNumber,
      incidentDate,
      policeRef,
      vehicleDetails: `${
        vehicle.makeModel || `${vehicle.make || ''} ${vehicle.model || ''}`
      } ${vehicle.colour ? `(${vehicle.colour})` : ''} - ${vehicle.reg || ''}`.trim(),
      insuranceDetails: `${insurance.company || ''} - Policy ${insurance.policyNumber || ''}`,
    });

    await resend.emails.send({
      from: 'Police Scotland <noreply@resend.dev>',
      to: email,
      subject: 'Crash Report Confirmation',
      html,
    });

    res.status(200).json({ success: true, id: incidentNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

interface EmailTemplateOpts {
  fullName: string;
  email: string;
  constable: string;
  location: string;
  locationNotes?: string;
  incidentNumber: string;
  incidentDate?: string;
  policeRef?: string;
  vehicleDetails: string;
  insuranceDetails: string;
}

function generateInitialEmailTemplate({
  fullName,
  email,
  constable,
  location,
  locationNotes,
  incidentNumber,
  incidentDate,
  policeRef,
  vehicleDetails,
  insuranceDetails,
}: EmailTemplateOpts): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Crash Report Received</title>
        <style>
          body {
            background-color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            padding: 30px 40px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          }
          .logo { text-align: center; margin-bottom: 24px; }
          .logo img { max-width: 160px; height: auto; }
          h1 { font-size: 20px; color: #222; margin-bottom: 20px; }
          .info { margin-bottom: 16px; }
          .info strong { display: inline-block; width: 140px; color: #555; }
          p.message { margin-top: 24px; line-height: 1.5; color: #444; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://iili.io/FoKMGEv.md.png" alt="Crash Report Logo" />
          </div>
          <h1>Thank you for submitting your crash report</h1>
          <div class="info"><strong>Full Name:</strong> ${fullName}</div>
          <div class="info"><strong>Email:</strong> ${email}</div>
          <div class="info"><strong>Vehicle:</strong> ${vehicleDetails}</div>
          <div class="info"><strong>Insurance:</strong> ${insuranceDetails}</div>
          <div class="info"><strong>Constable:</strong> ${constable}</div>
          <div class="info"><strong>Location:</strong> ${location}</div>
          ${locationNotes ? `<div class="info"><strong>Location Notes:</strong> ${locationNotes}</div>` : ''}
          <div class="info"><strong>Date of Incident:</strong> ${incidentDate ? new Date(incidentDate).toLocaleDateString() : ''}</div>
          <div class="info"><strong>Ref:</strong> ${policeRef}</div>
          <p class="message">
            We’ve received your submission. Once all other parties involved have entered their details and the officer has reviewed the information, a full summary report will be sent to you and others involved.
          </p>
          <p class="message">
            You can view or update the report at <a href="${process.env.BASE_URL}/view-report">${process.env.BASE_URL}/view-report</a>.
            Keep this email to access your report later.
          </p>
          <div class="footer">
            Police Scotland — This message was sent automatically from the Crash Report System
          </div>
        </div>
      </body>
    </html>
  `;
}
