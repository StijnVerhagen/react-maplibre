import axios from 'axios';

const instance = axios.create({
    baseURL: `https://dev.7analytics.no:3000`,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default instance;