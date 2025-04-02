// utils/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_WEBAPP_SERVER_URL,
  withCredentials:true
});

export default api;
