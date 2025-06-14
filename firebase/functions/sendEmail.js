// firebase/functions/sendEmail.js
const functions = require('firebase-functions');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  const { id, parties } = req.body;
  const emails = parties.map(p => p.email).filter(Boolean);
  const link = `${process.env.BASE_URL}/rtc/${id}`;
  await resend.emails.send({
    from: 'roads@scotland.police.uk',
    to: emails,
    subject: 'RTC Report',
    html: `<p>A new RTC has been recorded. View at <a href="${link}">${link}</a></p>`,
  });
  res.send('ok');
});
