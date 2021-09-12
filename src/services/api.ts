import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_URL as string;

const api = axios.create({
  baseURL: BASE_API_URL,
});

export default api;
