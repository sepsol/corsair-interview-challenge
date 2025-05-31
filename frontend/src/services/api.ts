import axios from 'axios';

/**
 * Axios instance configured with base URL and default settings
 * 
 * Features:
 * - Base URL from environment variables
 * - JSON content type headers
 * - Request/response interceptors for development logging
 * - Timeout configuration
 */
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and development logging
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for development logging and error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Response received: ${response.status} ${response.statusText}`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development' && axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;