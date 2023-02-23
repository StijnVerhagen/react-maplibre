import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '../lib/maplibre-gl-inspect.css';
import '../lib/maplibre-gl-inspect.min.js';
import { useControl } from 'react-map-gl';

const InspectControls = (map, optionsLabel) => {
  map.addControl(
    new MaplibreInspect({
      showMapPopup: true,
      showInspectButton: false,
      showMapPopupOnHover: false,
      // showInspectMapPopupOnHover: false,
      queryParameters: {
        layers: optionsLabel,
      },
      renderPopup: function (features) {
        var html = features.map((feature, i) => {
          return `<p style="font-size: 14px;"><strong>${i + 1}. <br>${feature.properties.Navn}</strong></p><p>${
            feature.properties.Beskrivelse
          }</p><br>`;
        });
        return html.join('');
      },
    })
  );
};

export default InspectControls;
