// Description: Map component
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

import Map, { useControl } from 'react-map-gl';

import MapLibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import './style.css';

import * as turf from '@turf/turf';

import MapControls from './Controllers/MapControls';
import DrawControls from './Controllers/DrawControls';
import InspectControls from './Controllers/InspectControls';

import checkIntersection from './Functions/checkIntersection';
import useMapInteractions from './Functions/useMapInteractions';

import SourceLoader from './SourceLoader';
import ControlPanel from './ControlPanel';

import Max from '@Api/max.json';

const MapComp = () => {
  const baseMapStyle =
    'https://api.maptiler.com/maps/e04fad8e-6ec8-4dd0-afda-eeef9d7ab030/style.json?key=4g2o5EcoGa5b3sc9qbM8';
  const mapRef = useRef();

  const mapSources = Max.sources;
  const mapLayers = Max.layers;

  const options = [];
  const layerOptions = [];

  const [drawnFeatures, setDrawnFeatures] = useState({});
  const [inputValue, setInputValue] = useState([]);
  const [cursor, setCursor] = useState('auto');

  // Set initial view state
  const [viewState, setViewState] = useState({
    longitude: 5.324372871671272,
    latitude: 60.39275398399687,
    // center: [5.325152125309785, 60.39108523885861],
    zoom: 16,
    pitch: 0,
    bearing: 0,
  });

  // Set layer values and labels for control panel
  mapLayers.map((layer) => {
    options.push({ label: layer.id, value: layer });
    layerOptions.push(layer.id);
  });

  // Set layer visibility on input field change
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
  const setLayerVisibility = (layerId, visibility) => {
    return mapRef.current.getMap().setLayoutProperty(layerId, 'visibility', visibility);
  };

  // Set cursor style on mouse move over extra layer
  // TODO: Make this layer specific
  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  // Update view state on map move
  const onMapMove = useCallback(({ viewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    if (true) {
      setViewState(newCenter);
    } else {
    }
  }, []);

  const onDrawFilter = (features) => {
    checkIntersection(features, layerOptions, mapRef);
  };

  // Create/update drawn features
  const onDrawUpdate = useCallback((e) => {
    setDrawnFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      // Loop through all drawn features and check if they intersect
      onDrawFilter(newFeatures);
      return newFeatures;
    });
  }, []);

  // Delete drawn features
  const onDrawDelete = useCallback((e) => {
    setDrawnFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const onMapLoad = useCallback(() => {
    // Run inspect controls function
    InspectControls(mapRef.current, layerOptions);

    let hoveredState = { id: null, source: null, sourceLayer: null };

    layerOptions.forEach((layer) => {
      // Hover effect
      // On hover give hover state effect
      const onLayerHover = (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const { id, source, sourceLayer } = feature;
          if (id !== hoveredState.id || source !== hoveredState.source || sourceLayer !== hoveredState.sourceLayer) {
            if (hoveredState.id) {
              mapRef.current.setFeatureState(
                { id: hoveredState.id, source: hoveredState.source, sourceLayer: hoveredState.sourceLayer },
                { hover: false }
              );
            }
            hoveredState = { id, source, sourceLayer };
            mapRef.current.setFeatureState({ id, source, sourceLayer }, { hover: true });
          }
        }
      };
      mapRef.current.on('mousemove', layer, onLayerHover);

      // On leave reset hover state effect
      const onLayerLeave = () => {
        if (hoveredState.id) {
          mapRef.current.setFeatureState(
            { id: hoveredState.id, source: hoveredState.source, sourceLayer: hoveredState.sourceLayer },
            { hover: false }
          );
          hoveredState = { id: null, source: null, sourceLayer: null };
        }
      };
      mapRef.current.on('mouseleave', layer, onLayerLeave);

      // Click effect
      const onLayerClick = (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const { id, source, sourceLayer } = feature;
          if (hoveredState.id === id && hoveredState.source === source && hoveredState.sourceLayer === sourceLayer) {
            const active = !mapRef.current.getFeatureState({ id, source, sourceLayer }).active;
            mapRef.current.setFeatureState({ id, source, sourceLayer }, { active });
          }
        }
      };
      mapRef.current.on('click', layer, onLayerClick);
    });
  }, []);

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
        onMove={onMapMove}
        cursor={cursor}
        interactiveLayerIds={layerOptions}
      >
        <DrawControls
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          onDrawCreate={onDrawUpdate}
          onDrawUpdate={onDrawUpdate}
          onDrawDelete={onDrawDelete}
        />
        <MapControls position="bottom-right" />

        <SourceLoader map={mapRef.current} mapSources={mapSources} mapLayers={mapLayers} />
      </Map>
      <ControlPanel
        polygons={Object.values(drawnFeatures)}
        options={options}
        handleChange={handleChange}
        // changeDrawMode={changeDrawMode}
      />
    </div>
  );
};

export default MapComp;
