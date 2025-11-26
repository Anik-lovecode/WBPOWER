// MapSection.jsx
import React from 'react';
import PropTypes from 'prop-types';


  // Props:
  // - mapUrl: string (a Google Maps embed url or other embeddable map url)
 
  // Example mapUrl (Google embed):
  // "https://www.google.com/maps/embed?pb=..."
 
export default function MapSection({ mapUrl, height = 240 }) {
  return (
    <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <h3 style={{ margin: '12px', marginBottom: 6, fontSize: 16 }}>Location Map</h3>

      <div style={{ padding: 12 }}>
        {mapUrl ? (
          <div style={{ width: '100%', height }}>
            <iframe
              title="contact-map"
              src={mapUrl}
              style={{ width: '100%', height: '100%', border: 0 }}
              loading="lazy"
              aria-hidden={false}
            />
          </div>
        ) : (
          <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Map not available
          </div>
        )}
      </div>
    </div>
  );
}

MapSection.propTypes = {
  mapUrl: PropTypes.string,
  height: PropTypes.number,
};
