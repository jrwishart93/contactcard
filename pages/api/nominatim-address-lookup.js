 // pages/api/nominatim-address-lookup.js
export default async function handler(req, res) {
    const { postcode = '', house = '' } = req.query;
    if (!postcode.trim()) {
      return res.status(400).json({ error: 'Postcode required' });
    }
  
    // build your query: "EH11 2JT 30"
    const q = encodeURIComponent(`${postcode.trim()} ${house.trim()}`.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&countrycodes=gb&format=json&limit=5&addressdetails=1`;
  
    try {
      const nomRes = await fetch(url, {
        headers: {
          // Nominatim requires a valid User-Agent or Referer
          'User-Agent': 'contact-card-app/1.0 (your-email@domain.com)'
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
  