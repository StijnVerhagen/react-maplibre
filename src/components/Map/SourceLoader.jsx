import React from 'react';
import { Source, Layer } from 'react-map-gl';

const SourceLoader = ({ map, mapSources, mapLayers }) => {
  return (
    <>
      {' '}
      {Object.keys(mapSources).map((sourceKey, i) => (
        <Source
          id={sourceKey}
          promoteId="bygningsnummer"
          // promoteId="nvdbId"
          key={sourceKey + '__' + i}
          type={mapSources[sourceKey].type}
          maxzoom={mapSources[sourceKey].maxZoom}
          minzoom={mapSources[sourceKey].minZoom}
          tiles={mapSources[sourceKey].tiles}
        >
          {mapLayers.map((layer) => {
            if (layer.source === sourceKey) {
              // console.log(layer);
              // Set feature state of on click
              if (layer.type === 'fill') {
                layer.paint['fill-color'] = [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  '#ff0033',
                  ['boolean', ['feature-state', 'active'], false],
                  '#ff0033',
                  layer.paint['fill-color'],
                ];
                // Set feature state of on hover
                layer.paint['fill-opacity'] = [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  ['boolean', ['feature-state', 'active'], false],
                  1,
                  0.4,
                ];
              } else if (layer.type === 'line') {
                layer.paint['line-color'] = [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  '#ff0033',
                  ['boolean', ['feature-state', 'active'], false],
                  '#ff0033',
                  layer.paint['line-color'],
                ];
                // Set feature state of on hover
                layer.paint['line-opacity'] = [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  ['boolean', ['feature-state', 'active'], false],
                  1,
                  0.6,
                ];

                // Set line width on zoom
                layer.paint['line-width'] = ['interpolate', ['exponential', 1], ['zoom'], 15, 1, 22, 20];
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
