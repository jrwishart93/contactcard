// pages/api/sendEmail.js
export default async function handler(req, res) {
  await fetch(process.env.BASE_URL + '/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  res.status(200).json({ ok: true });
}
