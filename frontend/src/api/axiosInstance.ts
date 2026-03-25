import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * - Base URL points to the Spring Boot backend
 * - Request interceptor attaches the JWT Bearer token from localStorage
 * - Response interceptor handles 401 (token expiry → redirect to login)
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rbac_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('rbac_token');
      localStorage.removeItem('rbac_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
