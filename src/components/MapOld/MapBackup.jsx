// Description: Map component
import React, { useState, useEffect, useRef, useMemo } from 'react';

//// Libraries ////
// React Map GL
import Map, {
  Source,
  Layer,
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
// MapLibre
import MapLibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Select field
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import DeckGL from '@deck.gl/react';
import { LineLayer, PolygonLayer } from '@deck.gl/layers';

import Max from './max.json';

const MapComp = () => {
    const mapSources = Max.sources;
    const mapLayers = Max.layers;
    const options = [];
    const mapRef = useRef();
    const animatedComponents = makeAnimated();
    const [inputValue, setInputValue] = useState([]);
    const [viewState, setViewState] = React.useState({
      longitude: 5.324372871671272,
      latitude: 60.39275398399687,
      zoom: 13,
      pitch: 0,
      bearing: 0,
    });
    mapLayers.map((layer) => {
      options.push({ label: layer.id, value: layer });
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
    // Define action handlers
    const onMove = React.useCallback(({ viewState }) => {
      const newCenter = [viewState.longitude, viewState.latitude];
      // Only update the view state if the center is inside the geofence
      if (true) {
        setViewState(newCenter);
      } else {
      }
    }, []);
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-center text-dark">
        <DeckGL initialViewState={...viewState} controller={true} layers={layers}>
          <Map
            mapLib={MapLibreGl}
            ref={mapRef}
            {...viewState}
            onMove={onMove}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://api.maptiler.com/maps/e04fad8e-6ec8-4dd0-afda-eeef9d7ab030/style.json?key=4g2o5EcoGa5b3sc9qbM8"
          >
            <ScaleControl />
            <NavigationControl position="bottom-right" />
            <FullscreenControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />
            {Object.keys(mapSources).map((sourceKey, i) => (
              <Source
                id={sourceKey}
                key={sourceKey + '__' + i}
                type={mapSources[sourceKey].type}
                tiles={mapSources[sourceKey].tiles}
              >
                {mapLayers.map((layer) => {
                  if (layer.source === sourceKey) {
                    return <Layer key={layer.id} {...layer} />;
                  }
                  // Tune up needed in the future
                  return null;
                })}
              </Source>
            ))}
          </Map>
        </DeckGL>
        <div className="absolute top-5 right-5">
          <div className="w-[450px] rounded-xl border border-gray-50 bg-white p-5 shadow-md">
            <p className="text-md text-gray-700">Select your layers to display</p>
            <div className="h-100 mt-4 w-full">
              <Select
                isMulti
                name="layers"
                options={options}
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(newValue) => handleChange(newValue)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <button className="mr-5" onClick={() => changeDrawMode('draw_circle')}>
              Draw circle mode
            </button>
            <button onClick={() => changeDrawMode('drag_circle')}>Drag circle mode</button>
          </div>
        </div>
      </div>
    );
};

export default MapComp;
