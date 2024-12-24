// src/services/axiosInstance.ts

import axios from 'axios';
import { AuthService } from './AuthService';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.100.190:5000', // Ajusta según tu backend
});

// Agregar un interceptor para incluir el token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
