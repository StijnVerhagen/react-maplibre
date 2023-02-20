// Description: Map component
import React, { useState, useCallback, useEffect } from 'react';

//// Libraries ////
// React Map GL
import Map, { NavigationControl, Source, Layer } from 'react-map-gl';
// MapLibre
import MapLibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Mapbox Draw
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
// Turf
import * as turf from '@turf/turf';

// Components
import ControlDraw from './control-draw';

// API Services
import MapDataService from '@Api/mapData';

// A circle of 5 mile radius of the Empire State Building
const GEOFENCE = turf.circle([5.3242, 60.393], 5, { units: 'kilometers' });

const Welcome = () => {
  const [features, setFeatures] = useState({});

  const [mapData, setMapData] = useState([]);

  const [viewState, setViewState] = React.useState({
    longitude: 5.3242,
    latitude: 60.393,
    zoom: 15,
    pitch: 50,
  });

  const onMove = React.useCallback(({ viewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    if (turf.booleanPointInPolygon(newCenter, GEOFENCE)) {
      setViewState(newCenter);
    }
  }, []);

  useEffect(() => {
    MapDataService.getFile('brannsmitteomrader.brannsmitteomrade.json').then((resGetFile) => {
      setMapData(resGetFile);
    });
  }, []);

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
        {...viewState}
        onMove={onMove}
        mapLib={MapLibreGl}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://api.maptiler.com/maps/e04fad8e-6ec8-4dd0-afda-eeef9d7ab030/style.json?key=4g2o5EcoGa5b3sc9qbM8"
      >
        {/* <Source id="ny-vector" type="vector" data={mapData}>
          <Layer {...parkLayer} />
        </Source> */}

        <NavigationControl position="top-left" />
        <ControlDraw
          position="top-left"
          displayControlsDefault={false}
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
    </div>
  );
};

export default Welcome;
