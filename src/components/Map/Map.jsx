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
import MapboxDraw from '@mapbox/mapbox-gl-draw';
// MapLibre
import MapLibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Mapbox Draw
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// API Services
import MapDataService from '@Api/mapData';

import Max from './max.json';

function DrawControl(props) {
  useControl(() => new MapboxDraw(props), {
    position: props.position,
  });

  return null;
}

const MapComp = () => {
  // Define states
  const mapSources = Max.sources;
  const mapLayers = Max.layers;
  const mapRef = useRef();
  const animatedComponents = makeAnimated();
  const [inputValue, setInputValue] = useState([]);

  const [viewState, setViewState] = React.useState({
    longitude: 5.324372871671272,
    latitude: 60.39275398399687,
    zoom: 13,
  });

  // // Define variables
  const options = [];
  mapLayers.forEach((layer) => {
    // console.log(layer);
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
    console.log(newValue);
    return newValue;
  };

  // UseEffect for fetching API data
  useEffect(() => {
    // MapDataService.getFile('public.bg_popden.json').then((resGetFile) => {
    //   setMapData(resGetFile);
    // });
    // MapDataService.getAll().then((resGetAllFiles) => {
    //   setAllMapData([resGetAllFiles]);
    // });
  }, []);

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
      <Map
        {...viewState}
        ref={mapRef}
        onMove={onMove}
        mapLib={MapLibreGl}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://api.maptiler.com/maps/e04fad8e-6ec8-4dd0-afda-eeef9d7ab030/style.json?key=4g2o5EcoGa5b3sc9qbM8"
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={true}
          controls={{
            polygon: true,
            trash: true,
          }}
        />

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
        </div>
      </div>
    </div>
  );
};

export default MapComp;
