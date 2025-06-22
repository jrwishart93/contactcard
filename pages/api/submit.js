import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase/config';
import validateConfig from '../../firebase/validateConfig';

// Validate Firebase configuration before anything else
validateConfig();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Re-validate and initialize Firebase if needed
  validateConfig();
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const db = getFirestore();

  const {
    incidentNumber,
    userId,
    fullName,
    email,
    constable,
    location,
    vehicle,
    insurance,
    incidentDate,
    policeRef,
    phone,
  } = req.body || {};

  if (
    !incidentNumber ||
    !userId ||
    !fullName ||
    !email ||
    !incidentDate ||
    !policeRef
  ) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    await setDoc(
      doc(db, 'rtc', incidentNumber, 'submissions', userId),
      {
        fullName,
        email,
        constable,
        location,
        vehicle,
        insurance,
        incidentDate,
        policeRef,
        phone,
        submittedAt: new Date(),
      }
    );

    const vehicleDetails = vehicle.makeModel
      ? vehicle.makeModel
      : `${vehicle.make || ''} ${vehicle.model || ''}`.trim() +
        (vehicle.colour ? ` (${vehicle.colour})` : '') +
        ` - ${vehicle.reg || ''}`;

    const insuranceDetails = `${insurance.company || ''} - Policy ${insurance.policyNumber || ''}`;

    const html = generateInitialEmailTemplate({
      fullName,
      email,
      constable,
      location,
      incidentNumber,
      incidentDate,
      policeRef,
      vehicleDetails,
      insuranceDetails,
    });

    await resend.emails.send({
      from: 'Police Scotland <noreply@resend.dev>',
      to: email,
      subject: 'Crash Report Confirmation',
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

function generateInitialEmailTemplate({
  fullName,
  email,
  constable,
  location,
  incidentNumber,
  incidentDate,
  policeRef,
  vehicleDetails,
  insuranceDetails,
}) {
  const formattedDate = incidentDate
    ? new Date(incidentDate).toLocaleDateString('en-GB')
    : '';

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
          <div class="info"><strong>Date of Incident:</strong> ${formattedDate}</div>
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
