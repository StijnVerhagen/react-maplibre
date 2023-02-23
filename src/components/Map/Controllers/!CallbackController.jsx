import { useCallback } from 'react';

const onMouseEnter = useCallback(() => setCursor('pointer'), []);
const onMouseLeave = useCallback(() => setCursor('auto'), []);

const onDrawUpdate = useCallback((e) => {
  setFeatures((currFeatures) => {
    const newFeatures = { ...currFeatures };
    for (const f of e.features) {
      newFeatures[f.id] = f;
      drawnPolygons.push(newFeatures);
    }
    return newFeatures;
  });
}, []);

const onDrawDelete = useCallback((e) => {
  setFeatures((currFeatures) => {
    const newFeatures = { ...currFeatures };
    for (const f of e.features) {
      delete newFeatures[f.id];
    }
    return newFeatures;
  });
}, []);

const onMapLoad = useCallback(() => {
  InspectControls(mapRef.current, optionsLabel);

  mapRef.current.on('click', 'bygninger_pop', (e) => {
    var point = turf.centerOfMass(turf.polygon(e.features[0].geometry.coordinates));
    mapRef.current.flyTo({
      center: point.geometry.coordinates,
      essential: true,
      speed: 0.3,
    });
  });
}, []);

const CallbackController = {
  onDrawUpdate,
  onDrawDelete,
  onMapLoad,
  onMouseEnter,
  onMouseLeave,
};

export default CallbackController;
