const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (for index.html and main.js)
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/uk-addresses?postcode=...
app.get('/api/uk-addresses', async (req, res) => {
  const postcode = req.query.postcode ? req.query.postcode.toString().trim() : '';
  if (!postcode) {
    return res.status(400).json({ error: 'Postcode query parameter required' });
  }

  try {
    const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}/autocomplete`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch postcode data' });
    }
    const data = await response.json();
    const results = data && Array.isArray(data.result) ? data.result : [];
    if (results.length === 0) {
      return res.status(404).json({ error: 'No addresses found' });
    }
    res.json({ addresses: results });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to fetch postcode data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
