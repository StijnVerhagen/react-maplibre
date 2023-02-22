import * as React from 'react';
import area from '@turf/area';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function ControlPanel({ polygons, options, handleChange, changeDrawMode }) {
  let polygonArea = 0;
  const animatedComponents = makeAnimated();

  for (const polygon of polygons) {
    polygonArea += area(polygon);
  }

  return (
    <div className="absolute top-5 right-5">
      <div className="w-[450px] rounded-xl border border-gray-50 bg-white p-5 shadow-md">
        <p className="text-md text-gray-700">Select your layers to display</p>
        <div className="h-100 mt-4 w-full">
          <Select
            isMulti
            name="layers"
            options={options}
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={(newValue) => handleChange(newValue)}
            // Pass handleChange to child component and send back value
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <button className="mr-5 mt-5" onClick={() => changeDrawMode('draw_circle')}>
          Draw circle mode
        </button>
        <button onClick={() => changeDrawMode('drag_circle')}>Drag circle mode</button>
        <div className="control-panel mt-5 rounded-xl bg-slate-50 p-5">
          <h4>Draw Polygon</h4>
          {polygonArea > 0 && (
            <p>
              {Math.round(polygonArea * 100) / 100} <br />
              square meters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
