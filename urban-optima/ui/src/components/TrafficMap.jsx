// MapViewer.jsx
import React, { useEffect, useRef } from 'react';

const TrafficMap = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = 'http://localhost:5000/map'; // Adjust port if needed
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        ref={iframeRef}
        title="Folium Map"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default TrafficMap;
