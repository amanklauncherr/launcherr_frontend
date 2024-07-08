import axios from 'axios';

export const API_BASE_URL = 'https://api.launcherr.co/api';


const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;

