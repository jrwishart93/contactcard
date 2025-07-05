// pages/api/mapbox-address-lookup.js
export default async function handler(req, res) {
  let { postcode = "", house = "" } = req.query;
  postcode = postcode.trim().toUpperCase().replace(/\s+/g, "");

  // put a space before the final 3 chars
  if (postcode.length > 3) {
    postcode = postcode.slice(0, -3) + " " + postcode.slice(-3);
  }

  if (!postcode) {
    return res.status(400).json({ error: "Postcode required" });
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing Mapbox token" });
  }

  console.log("mapbox lookup", { postcode, house });

  // build two queries: one with house, one without
  const baseUrl = (q) =>
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
    `?access_token=${token}&country=gb&autocomplete=true&limit=5&types=address`;

  // first try “postcode + house”
  const combined = [postcode, house.trim()].filter(Boolean).join(" ");
  for (let q of [combined, postcode]) {
    try {
      const url = baseUrl(q);
      console.log("→ fetching", url);
      const resp = await fetch(url);
      console.log("→ status", resp.status);
      if (!resp.ok) continue;
      const { features } = await resp.json();
      console.log("→ features", features.length);
      if (features.length) {
        const addresses = features.map((f) => f.place_name);
        return res.status(200).json({ addresses });
      }
    } catch (err) {
      console.error("Mapbox lookup error for", q, err);
      // try next
    }
  }

  // nothing found
  return res.status(200).json({ addresses: [] });
}
