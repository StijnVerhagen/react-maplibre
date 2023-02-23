import React from 'react';
import { NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';
const MapControls = (props) => {
  return (
    <>
      <ScaleControl />
      <NavigationControl position={props.position} />
      <FullscreenControl position={props.position} />
      <GeolocateControl position={props.position} />
    </>
  );
};

export default MapControls;
