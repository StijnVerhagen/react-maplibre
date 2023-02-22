import React from 'react';
import { Source, Layer } from 'react-map-gl';

const LoadSources = ({ mapSources, mapLayers }) => {
  return (
    <>
      {' '}
      {Object.keys(mapSources).map((sourceKey, i) => (
        <Source
          id={sourceKey}
          key={sourceKey + '__' + i}
          type={mapSources[sourceKey].type}
          maxzoom={mapSources[sourceKey].maxZoom}
          minzoom={mapSources[sourceKey].minZoom}
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
    </>
  );
};

export default LoadSources;
