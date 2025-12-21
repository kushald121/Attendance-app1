import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://attendance-app-backend-4.onrender.com/api',
  withCredentials: true, // Enable credentials for secure authentication
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request logging in development
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        withCredentials: config.withCredentials
      });
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );
}

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase()
    });
    
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    
    // Handle CORS errors specifically
    if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
      console.error('🚫 CORS or Network Error detected. Check backend CORS configuration.');
    }
    
    return Promise.reject(error);
  }
);

export default api;