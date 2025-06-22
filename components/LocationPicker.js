import { useEffect, useRef, useState } from 'react';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

export default function LocationPicker({ value = {}, onChange }) {
  const [search, setSearch] = useState(value.location || '');
  const [suggestions, setSuggestions] = useState([]);
  const [mapFailed, setMapFailed] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const geocoder = mbxGeocoding({ accessToken: token || '' });

  // Fetch suggestions as user types
  useEffect(() => {
    if (!token || search.length < 3) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    geocoder
      .forwardGeocode({ query: search, limit: 5, autocomplete: true })
      .send()
      .then((res) => {
        if (cancelled) return;
        setSuggestions(res.body.features || []);
      })
      .catch(() => setSuggestions([]));
    return () => {
      cancelled = true;
    };
  }, [search, geocoder, token]);

  // Initialize map when coordinates selected
  useEffect(() => {
    if (!token || mapRef.current || !value.lat || !value.lng || !mapContainerRef.current) return;
    import('mapbox-gl')
      .then((mbgl) => {
        mbgl.default.accessToken = token;
        mapRef.current = new mbgl.default.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [value.lng, value.lat],
          zoom: 14,
        });
        markerRef.current = new mbgl.default.Marker({ draggable: true })
          .setLngLat([value.lng, value.lat])
          .addTo(mapRef.current);
        markerRef.current.on('dragend', () => {
          const lngLat = markerRef.current.getLngLat();
          onChange({ ...value, lat: lngLat.lat.toFixed(6), lng: lngLat.lng.toFixed(6) });
        });
      })
      .catch((err) => {
        console.error(err);
        setMapFailed(true);
      });
  }, [token, value.lat, value.lng, onChange, value]);

  // Update marker/map when coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setCenter([value.lng, value.lat]);
      markerRef.current.setLngLat([value.lng, value.lat]);
    }
  }, [value.lat, value.lng]);

  if (!token || mapFailed) {
    return (
      <div>
        <textarea
          name="location_notes"
          value={value.locationNotes || ''}
          onChange={(e) => onChange({ ...value, locationNotes: e.target.value })}
          className="mt-1 block w-full p-3 border rounded text-base"
          placeholder="Location notes"
        />
        <input type="hidden" name="lat" value="" />
        <input type="hidden" name="lng" value="" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block font-medium">Location of Collision:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a place"
          className="mt-1 block w-full p-3 border rounded text-base"
        />
        {suggestions.length > 0 && (
          <ul className="border rounded bg-white dark:bg-gray-800 max-h-40 overflow-auto mt-1">
            {suggestions.map((feat) => (
              <li key={feat.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSearch(feat.place_name);
                    setSuggestions([]);
                    onChange({
                      ...value,
                      location: feat.place_name,
                      lat: feat.center[1].toFixed(6),
                      lng: feat.center[0].toFixed(6),
                    });
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {feat.place_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {value.lat && value.lng && (
        <div ref={mapContainerRef} className="w-full h-64 border rounded" />
      )}
      <textarea
        name="location_notes"
        value={value.locationNotes || ''}
        onChange={(e) => onChange({ ...value, locationNotes: e.target.value })}
        placeholder="Additional location notes"
        className="block w-full p-3 border rounded text-base"
      />
      <input type="hidden" name="lat" value={value.lat || ''} />
      <input type="hidden" name="lng" value={value.lng || ''} />
    </div>
  );
}
