import api from './api';

const getAll = async () =>
  api
    .get(`/index.json`)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err.response.data));

const getFile = async (file) =>
  api
    .get(`/${file}`)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err.response));


const MapDataService = {
    getFile,
    getAll
};

export default MapDataService;