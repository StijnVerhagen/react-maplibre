import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useControl } from 'react-map-gl';

export default function DrawControl(props) {
  useControl(
    () => new MapboxDraw(props),
    ({ map }) => {
      map.on('draw.create', props.onDrawUpdate);
      map.on('draw.update', props.onDrawUpdate);
      map.on('draw.delete', props.onDrawDelete);
    },
    ({ map }) => {
      map.off('draw.create', props.onDrawUpdate);
      map.off('draw.update', props.onDrawUpdate);
      map.off('draw.delete', props.onDrawDelete);
    },
    {
      position: props.position,
    }
  );
  return null;
}
DrawControl.defaultProps = {
  onDrawCreate: () => {},
  onDrawUpdate: () => {},
  onDrawDelete: () => {},
};
