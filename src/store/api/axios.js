import axios from 'axios';

export const API_BASE_URL = 'https://api.launcherr.co/api';

// export const API_BASE_URL = 'http://127.0.0.1:8000/api';


const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;

