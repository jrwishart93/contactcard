import React from 'react';

export default function LocationPicker({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        }));
      },
      () => alert('Unable to retrieve your location')
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block font-medium">Location of Collision:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter street or area"
            className="mt-1 block w-full p-3 border rounded text-base"
          />
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          className="px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-base"
        >
          Use My Location
        </button>
      </div>
      {formData.lat && formData.lng && (
        <div className="mt-2">
          <iframe
            title="map"
            width="100%"
            height="300"
            className="border rounded"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.lng - 0.005},${formData.lat - 0.005},${formData.lng + 0.005},${formData.lat + 0.005}&layer=mapnik&marker=${formData.lat},${formData.lng}`}
          />
          <p className="text-sm mt-1">
            <a
              href={`https://www.openstreetmap.org/?mlat=${formData.lat}&mlon=${formData.lng}#map=18/${formData.lat}/${formData.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on OpenStreetMap
            </a>
          </p>
        </div>
      )}
      <div>
        <label className="block font-medium">Location Notes:</label>
        <textarea
          name="locationNotes"
          value={formData.locationNotes}
          onChange={handleChange}
          placeholder="Additional information about the location"
          className="mt-2 block w-full p-3 border rounded text-base"
        />
      </div>
    </>
  );
}
