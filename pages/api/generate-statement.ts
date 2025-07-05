import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const body = req.body || {};
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a police administrative assistant...' },
        { role: 'user', content: JSON.stringify(body) },
      ],
    });
    const text = completion.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate statement' });
  }
}
