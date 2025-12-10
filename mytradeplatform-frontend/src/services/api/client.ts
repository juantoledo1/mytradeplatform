import axios, { AxiosHeaders } from "axios";
import { SERVER_URL } from "@/config";

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Obtener token del localStorage
  const token = localStorage.getItem('accessToken');
  
  if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }
  const headers = config.headers as AxiosHeaders;

  // Incluir el token en las cabeceras si existe
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (isFormData) {
    headers.set("Content-Type", "multipart/form-data");
  }

  return config;
});

// Interceptor de respuesta para manejar errores 401 (token expirado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar datos de autenticación
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      
      // Redirigir al login si no estamos ya en la página de autenticación
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);
