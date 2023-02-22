import React from 'react';
import { NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';
const MapControls = () => {
  return (
    <>
      <ScaleControl />
      <NavigationControl position="bottom-right" />
      <FullscreenControl position="bottom-right" />
      <GeolocateControl position="bottom-right" />
    </>
  );
};

export default MapControls;
