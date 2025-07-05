// components/LocationPicker.js
import { useEffect, useRef, useState, useMemo } from 'react'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'

export default function LocationPicker({
  value: { location = '', lat = '', lng = '', locationNotes = '' } = {},
  onChange,
}) {
  const [search, setSearch] = useState(location)
  const [suggestions, setSuggestions] = useState([])
  const [mapFailed, setMapFailed] = useState(false)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapContainerRef = useRef(null)

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // create geocoder once
  const geocoder = useMemo(
    () => mbxGeocoding({ accessToken: token || '' }),
    [token]
  )

  // 1) suggestions effect
  useEffect(() => {
    if (!token || search.length < 3) {
      setSuggestions([])
      return
    }
    let cancelled = false
    geocoder
      .forwardGeocode({
        query: search,
        limit: 5,
        autocomplete: true,
        countries: ['gb'],
      })
      .send()
      .then((res) => {
        if (!cancelled) setSuggestions(res.body.features || [])
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
    return () => {
      cancelled = true
    }
  }, [search, token, geocoder])

  // 2) initialize map once when we first get coords
  useEffect(() => {
    if (!token || mapRef.current || !lat || !lng || !mapContainerRef.current)
      return

    import('mapbox-gl')
      .then((mbgl) => {
        mbgl.default.accessToken = token
        mapRef.current = new mbgl.default.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 14,
        })
        markerRef.current = new mbgl.default.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapRef.current)

        markerRef.current.on('dragend', () => {
          const { lat: newLat, lng: newLng } = markerRef.current.getLngLat()
          onChange({
            location,
            lat: newLat.toFixed(6),
            lng: newLng.toFixed(6),
            locationNotes,
          })
        })
      })
      .catch((err) => {
        console.error(err)
        setMapFailed(true)
      })
  }, [token, lat, lng, onChange, locationNotes, location])

  // 3) keep marker & center in sync when coords change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setCenter([lng, lat])
      markerRef.current.setLngLat([lng, lat])
    }
  }, [lat, lng])

  // fallback UI if no token or map failed
  if (!token || mapFailed) {
    return (
      <div className="space-y-4">
        <label className="block font-medium">Location of Collision:</label>
        <input
          type="text"
          name="location"
          value={location}
          onChange={(e) =>
            onChange({ location: e.target.value, lat, lng, locationNotes })
          }
          placeholder="Enter street or area"
          className="mt-1 block w-full p-3 border rounded"
        />
        <label className="block font-medium">Location Notes:</label>
        <textarea
          name="locationNotes"
          value={locationNotes}
          onChange={(e) =>
            onChange({ location, lat, lng, locationNotes: e.target.value })
          }
          placeholder="Additional info"
          className="mt-1 block w-full p-3 border rounded"
        />
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
      </div>
    )
  }

  // normal UI with map & suggestions
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Location of Collision:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a place"
          className="mt-1 block w-full p-3 border rounded"
        />
        {suggestions.length > 0 && (
          <ul className="border rounded bg-white max-h-40 overflow-auto mt-1">
            {suggestions.map((feat) => (
              <li key={feat.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSearch(feat.place_name)
                    setSuggestions([])
                    onChange({
                      location: feat.place_name,
                      lat: feat.center[1].toFixed(6),
                      lng: feat.center[0].toFixed(6),
                      locationNotes,
                    })
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                >
                  {feat.place_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lat && lng && (
        <div
          ref={mapContainerRef}
          className="w-full h-64 border rounded"
        />
      )}

      <label className="block font-medium">Location Notes:</label>
      <textarea
        name="locationNotes"
        value={locationNotes}
        onChange={(e) =>
          onChange({ location, lat, lng, locationNotes: e.target.value })
        }
        placeholder="Additional info"
        className="mt-1 block w-full p-3 border rounded"
      />
      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
    </div>
  )
}
