import { useEffect, useState } from 'react';

const useMapInteractions = (mapRef, layerOptions) => {
  const [hoveredState, setHoveredState] = useState({ id: null, source: null, sourceLayer: null });

  useEffect(() => {
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
          setHoveredState({ id, source, sourceLayer });
          mapRef.current.setFeatureState({ id, source, sourceLayer }, { hover: true });
        }
      }
    };

    const onLayerLeave = () => {
      if (hoveredState.id) {
        mapRef.current.setFeatureState(
          { id: hoveredState.id, source: hoveredState.source, sourceLayer: hoveredState.sourceLayer },
          { hover: false }
        );
        setHoveredState({ id: null, source: null, sourceLayer: null });
      }
    };

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

    layerOptions.forEach((layer) => {
      mapRef.current.on('mousemove', layer, onLayerHover);
      mapRef.current.on('mouseleave', layer, onLayerLeave);
      mapRef.current.on('click', layer, onLayerClick);
    });

    return () => {
      layerOptions.forEach((layer) => {
        mapRef.current.off('mousemove', layer, onLayerHover);
        mapRef.current.off('mouseleave', layer, onLayerLeave);
        mapRef.current.off('click', layer, onLayerClick);
      });
    };
  }, [mapRef, layerOptions, hoveredState]);

  return hoveredState;
};

export default useMapInteractions;
