// utils/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_WEBAPP_SERVER_URL,
  credentials:true// Your backend server's base URL
});

export default api;
