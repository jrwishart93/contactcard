import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const result = await resend.emails.send({
      from: 'Police Scotland <noreply@resend.dev>',
      to: 'folk_dragnet.2a@icloud.com', // Replace with your real email
      subject: 'Test Email from Resend',
      html: `<p>This is a test email from the Contact Card system.</p>`,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
