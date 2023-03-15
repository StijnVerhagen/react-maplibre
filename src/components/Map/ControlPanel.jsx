import React, { useEffect, useState } from 'react';
import area from '@turf/area';
import axios from 'axios';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import MapDataService from '@Api/mapData';

const ControlPanel = ({ polygons, options, handleChange, changeDrawMode }) => {
  let polygonArea = 0;
  const animatedComponents = makeAnimated();
  const [response, setResponse] = useState({});
  const [inputResponse, setInputResponse] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const apiOptions = [];

  for (const polygon of polygons) {
    polygonArea += area(polygon);
  }

  // useEffect(() => {
  //   axios.get('http://dev.7analytics.no:3000/').then((response) => {
  //     setResponse(response.data.paths);
  //   });
  // }, []);

  // // On change
  //   // Values in array
  //   // Loop through array
  //     // 	Api call for each value
  //     // 	Put api response in array
  //     // 	Console log array

  // const handleApiChange = (newValue) => {
  //   const newInputResponse = [];

  //   newValue.map((value) => {
  //     axios.get(`http://dev.7analytics.no:3000${value.value}`).then((response) => {
  //       newInputResponse.push(response.data);
  //     });
  //   });
  //   setInputValue(...inputValue, newInputResponse);
  //   console.log(inputValue);
  //   return newValue;
  // };

  // Object.keys(response).map((key) => {
  //   apiOptions.push({ value: key, label: key });
  // });

  return (
    <div className="absolute top-5 right-5 w-[450px]">
      <div className=" rounded-xl border border-gray-50 bg-white p-5 shadow-md">
        <p className="text-md text-gray-700">Select your layers to display</p>
        <div className="h-100 mt-4 w-full text-left">
          MapTiler data
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
        <div className="h-100 mt-4 w-full text-left">
          API data
          <Select
            isMulti
            name="layers"
            options={apiOptions}
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={(newValue) => handleApiChange(newValue)}
            // Pass handleChange to child component and send back value
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        {/* <button className="mr-5 mt-5" onClick={() => changeDrawMode('draw_circle')}>
          Draw circle mode
        </button>
        <button onClick={() => changeDrawMode('drag_circle')}>Drag circle mode</button> */}
        <div className="control-panel mt-5 rounded-xl bg-slate-50 p-5">
          {polygonArea > 0 ? (
            <>
              <p style={{ fontWeight: 'bold' }}>
                {Math.round(polygonArea * 100) / 100} <br />
              </p>
              <p>square meters</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 'bold' }}>
                0 <br />
              </p>
              <p>square meters</p>
            </>
          )}
        </div>
      </div>
      {/* <div className="mt-5 rounded-xl border border-gray-50 bg-white p-1 shadow-md">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Color
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">Silver</td>
              </tr>
              <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">White</td>
              </tr>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">Black</td>
              </tr>
              <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  Google Pixel Phone
                </th>
                <td className="px-6 py-4">Gray</td>
              </tr>
              <tr>
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  Apple Watch 5
                </th>
                <td className="px-6 py-4">Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(ControlPanel);
