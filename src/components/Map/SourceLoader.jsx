import React from 'react';
import { Source, Layer } from 'react-map-gl';

const SourceLoader = ({ map, mapSources, mapLayers }) => {
  return (
    <>
      {' '}
      {Object.keys(mapSources).map((sourceKey, i) => (
        <Source
          id={sourceKey}
          promoteId="nvdbId"
          key={sourceKey + '__' + i}
          type={mapSources[sourceKey].type}
          maxzoom={mapSources[sourceKey].maxZoom}
          minzoom={mapSources[sourceKey].minZoom}
          tiles={mapSources[sourceKey].tiles}
        >
          {mapLayers.map((layer) => {
            if (layer.source === sourceKey) {
              // Set feature state of on click
              if (layer.type === 'fill') {
                layer.paint['fill-color'] = [
                  'case',
                  ['boolean', ['feature-state', 'active'], false],
                  '#0000ff',
                  layer.paint['fill-color'],
                ];
                // Set feature state of on hover
                layer.paint['fill-opacity'] = ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.4];
              } else if (layer.type === 'line') {
                layer.paint['line-color'] = [
                  'case',
                  ['boolean', ['feature-state', 'active'], false],
                  '#0000ff',
                  layer.paint['line-color'],
                ];
                // Set feature state of on hover
                layer.paint['line-opacity'] = ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.4];
              }

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

export default SourceLoader;
