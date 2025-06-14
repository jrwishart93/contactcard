// pages/api/resend.js
export default async function handler(req, res) {
  const { id } = req.query;
  await fetch(process.env.BASE_URL + '/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  res.status(200).json({ ok: true });
}
