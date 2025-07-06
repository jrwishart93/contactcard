import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { id } = req.query;
  const base = process.env.BASE_URL;
  if (!base) {
    res.status(500).json({ error: 'BASE_URL environment variable not set' });
    return;
  }
  try {
    const resp = await fetch(base + '/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!resp.ok) {
      throw new Error(
        `Email service responded with ${resp.status} ${resp.statusText}`,
      );
    }
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to resend email' });
  }
}
