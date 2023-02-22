// Description: Map component
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

import Map, { useControl } from 'react-map-gl';

import MapLibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

import LoadSources from './LoadSources';
import MapControls from './MapControls';

import DrawControl from './DrawControl';
import ControlPanel from './ControlPanel';

import './lib/maplibre-gl-inspect.css';
import './lib/maplibre-gl-inspect.min.js';

import Max from './max.json';

const MapComp = () => {
  const mapSources = Max.sources;
  const mapLayers = Max.layers;
  const options = [];
  const optionsLabel = [];
  mapLayers.map((layer) => {
    options.push({ label: layer.id, value: layer });
    optionsLabel.push(layer.id);
  });

  // console.log(options);

  const baseMapStyle =
    'https://api.maptiler.com/maps/e04fad8e-6ec8-4dd0-afda-eeef9d7ab030/style.json?key=4g2o5EcoGa5b3sc9qbM8';

  const mapRef = useRef();

  const [features, setFeatures] = useState({});
  const [inputValue, setInputValue] = useState([]);

  const [viewState, setViewState] = React.useState({
    longitude: 5.324372871671272,
    latitude: 60.39275398399687,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });

  const setLayerVisibility = (layerId, visibility) => {
    return mapRef.current.getMap().setLayoutProperty(layerId, 'visibility', visibility);
  };

  const handleChange = (newValue) => {
    inputValue.map((value) => {
      setLayerVisibility(value.label, 'none');
    });
    newValue.map((newValue) => {
      setLayerVisibility(newValue.label, 'visible');
    });
    setInputValue(newValue);
    return newValue;
  };

  const onMove = useCallback(({ viewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    if (true) {
      setViewState(newCenter);
    } else {
    }
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

  const onMapLoad = useCallback(() => {
    mapRef.current.addControl(
      new MaplibreInspect({
        showMapPopup: true,
        showInspectButton: false,
        showMapPopupOnHover: false,
        // showInspectMapPopupOnHover: false,
        queryParameters: {
          layers: optionsLabel,
        },
      })
    );
  }, []);
  const [cursor, setCursor] = useState('auto');
  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center text-dark">
      <Map
        mapLib={MapLibreGl}
        ref={mapRef}
        onLoad={onMapLoad}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={baseMapStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMove={onMove}
        cursor={cursor}
        interactiveLayerIds={optionsLabel}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />

        {/* <InspectControls /> */}

        <MapControls />

        <LoadSources mapSources={mapSources} mapLayers={mapLayers} />
      </Map>

      <ControlPanel
        polygons={Object.values(features)}
        options={options}
        handleChange={handleChange}
        // changeDrawMode={changeDrawMode}
      />
    </div>
  );
};

export default MapComp;
