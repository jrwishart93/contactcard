const express = require('express');
const next = require('next');

const server = express();

// Serve static assets from the public directory
server.use(express.static('public'));

// GET /api/uk-addresses?postcode=...
server.get('/api/uk-addresses', async (req, res) => {
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

if (require.main === module) {
  const dev = process.env.NODE_ENV !== 'production';
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();
  const PORT = process.env.PORT || 3000;

  nextApp.prepare().then(() => {
    server.all('*', (req, res) => handle(req, res));
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
}

module.exports = server;
