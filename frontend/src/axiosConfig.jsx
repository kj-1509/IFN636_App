import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // locals
  baseURL: 'http://52.64.252.131', // live
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
