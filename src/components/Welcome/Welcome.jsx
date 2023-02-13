import React, { useState, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import MapLibreGl from 'maplibre-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import DrawControl from './draw-control';

const Welcome = () => {
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center text-dark">
      <Map
        mapLib={MapLibreGl}
        initialViewState={{
          longitude: 16.62662018,
          latitude: 49.2125578,
          zoom: 14,
        }}
        style={{ width: '100%', height: ' 90vh' }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=4g2o5EcoGa5b3sc9qbM8"
      >
        <NavigationControl position="top-left" />
        <DrawControl
          position="top-left"
          displayControlsDefault={true}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
      <p>={Object.values(features)[0].geometry.coordinates.toString()}</p>
    </div>
  );
};

export default Welcome;
