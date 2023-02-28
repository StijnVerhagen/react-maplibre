import React from 'react';
import * as turf from '@turf/turf';

const checkIntersection = (features, layerOptions, mapRef) => {
  const geometryToTurfFn = {
    Polygon: (coords) => turf.polygon(coords),
    LineString: (coords) => turf.lineString(coords),
    Point: (coords) => turf.point(coords),
  };

  const geometryTypeToString = {
    Polygon: 'Polygon intersects',
    LineString: 'Line intersects',
    Point: 'Point intersects',
  };

  Object.keys(features).forEach((key) => {
    const f = features[key];
    const { type, coordinates } = f.geometry;
    if (type in geometryToTurfFn) {
      const drawnTGeometry = geometryToTurfFn[type](coordinates);
      layerOptions.forEach((layer) => {
        const visibleFeaturesAsLayers = mapRef.current.queryRenderedFeatures({ layers: [layer] });
        visibleFeaturesAsLayers.forEach((feature) => {
          if (feature.geometry.type in geometryToTurfFn) {
            const intersectingTGeometry = geometryToTurfFn[feature.geometry.type](feature.geometry.coordinates);
            if (turf.booleanIntersects(drawnTGeometry, intersectingTGeometry)) {
              console.log(geometryTypeToString[feature.geometry.type]);
            }
          }
        });
      });
    }
  });
};

export default checkIntersection;
