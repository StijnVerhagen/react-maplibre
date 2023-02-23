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
  const optionsLabel = [];

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
    optionsLabel.push(layer.id);
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

  // const onDrawFilter = (features) => {
  //   if (Symbol.iterator in Object(features)) {
  //     for (const feature of features) {
  //       console.log(feature);
  //     }
  //   }

  //   // for (const feature of features) {
  //   console.log(features);
  //   // }

  //   // If feature is a polygon
  //   // if (feature.geometry.type === 'Polygon') {
  //   //   // Create a turf polygon from the feature
  //   //   const turfPolygon = turf.polygon(f.geometry.coordinates);
  //   //   // Check if the polygon intersects with the other visible features of the map
  //   //   // Loop through the intersecting features
  //   //   for (const intersectingFeature of intersectingFeatures) {
  //   //   }
  //   // }

  //   // const visibleFeaturesAsLayers = mapRef.current.queryRenderedFeatures(layer, {
  //   //   // filter: ['!=', 'id', f.id],
  //   //   filter: ['all', ['!=', 'id', props.f.id], ['==', 'type', 'Polygon']],
  //   // });
  //   // console.log(visibleFeaturesAsLayers);
  // };

  // Create/update drawn features
  const onDrawUpdate = useCallback((e) => {
    setDrawnFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }

      // Somewhere here loop through all drawn features and check if they intersect
      // onDrawFilter(newFeatures);

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
    InspectControls(mapRef.current, optionsLabel);

    var hoveredStateId = null;
    var hoveredStateSource = null;
    var hoveredStateSourceLayer = null;

    optionsLabel.map((layer) => {
      /////// Hover effect
      // On hover give hover state effect
      // TODO: Put in own function
      mapRef.current.on('mousemove', layer, function (e) {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            mapRef.current.setFeatureState(
              { id: hoveredStateId, source: e.features[0].source, sourceLayer: e.features[0].sourceLayer },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          hoveredStateSource = e.features[0].source;
          hoveredStateSourceLayer = e.features[0].sourceLayer;
          console.log(e.features[0]);

          mapRef.current.setFeatureState(
            { id: hoveredStateId, source: e.features[0].source, sourceLayer: e.features[0].sourceLayer },
            { hover: true }
          );
        }
      });
      // On leave reset hover state effect
      mapRef.current.on('mouseleave', layer, function () {
        if (hoveredStateId) {
          mapRef.current.setFeatureState(
            { id: hoveredStateId, source: hoveredStateSource, sourceLayer: hoveredStateSourceLayer },
            { hover: false }
          );
        }
        hoveredStateId, hoveredStateSource, (hoveredStateSourceLayer = null);
      });

      /////// Click effect
      mapRef.current.on('click', layer, (e) => {
        // Center map on polygon camera animation
        // TODO: Put in own function
        // var point = turf.centerOfMass(turf.polygon(e.features[0].geometry.coordinates));
        // mapRef.current.flyTo({
        //   center: point.geometry.coordinates,
        //   essential: true,
        //   speed: 0.3,
        // });

        // Toggle active state and select feature
        // TODO: Make these store in state
        if (hoveredStateId) {
          if (
            mapRef.current.getFeatureState({
              id: hoveredStateId,
              source: hoveredStateSource,
              sourceLayer: hoveredStateSourceLayer,
            }).active
          ) {
            mapRef.current.setFeatureState(
              { id: hoveredStateId, source: hoveredStateSource, sourceLayer: hoveredStateSourceLayer },
              { active: false }
            );
          } else {
            mapRef.current.setFeatureState(
              { id: hoveredStateId, source: hoveredStateSource, sourceLayer: hoveredStateSourceLayer },
              { active: true }
            );
          }
        }
      });
    }, []);
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
        interactiveLayerIds={optionsLabel}
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
