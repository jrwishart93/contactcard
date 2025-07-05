import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
    const { postcode = '', house = '' } = req.query;
    const pc = Array.isArray(postcode) ? postcode[0] : postcode;
    const hs = Array.isArray(house) ? house[0] : house;
    if (!pc.trim()) {
      return res.status(400).json({ error: 'Postcode required' });
    }

    // build your query: "EH11 2JT 30"
    const q = encodeURIComponent(`${pc.trim()} ${hs.trim()}`.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&countrycodes=gb&format=json&limit=5&addressdetails=1`;
    console.log('nominatim lookup', { postcode: pc, house: hs, url });
    
    try {
      const email = process.env.NEXT_PUBLIC_NOMINATIM_EMAIL || '';
      const nomRes = await fetch(url, {
        headers: {
          // Nominatim requires a valid User-Agent or Referer
          'User-Agent': email
            ? `contact-card-app/1.0 (${email})`
            : 'contact-card-app/1.0'
        }
      });
      if (!nomRes.ok) {
        const text = await nomRes.text();
        console.error('Nominatim error:', text);
        return res.status(nomRes.status).json({ error: 'Lookup failed' });
      }
  
      const results = await nomRes.json();
      // pull out the display_name for each result
      const addresses = results.map(r => r.display_name);
      return res.status(200).json({ addresses });
    } catch (err) {
      console.error('Lookup exception:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
