export default async function handler(req, res) {
  const { postcode = '', house = '' } = req.query;
  if (!postcode) return res.status(400).json({ error: 'Postcode required' });
  try {
    const url = `https://api.getAddress.io/find/${encodeURIComponent(postcode)}/${encodeURIComponent(house)}?api-key=${process.env.GETADDRESS_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text);
    }
    const data = await resp.json();
    res.status(200).json({ addresses: data.addresses || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
}
