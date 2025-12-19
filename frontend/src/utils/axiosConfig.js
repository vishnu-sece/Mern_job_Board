import axios from 'axios';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Request interceptor
axios.interceptors.request.use(
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

// Response interceptor for global error handling
axios.interceptors.response.use(
  (response) => {
    // Always ensure we have a proper response structure
    if (!response.data) {
      return {
        ...response,
        data: {
          success: false,
          data: null,
          message: 'Invalid response from server'
        }
      };
    }
    
    // Ensure response has required fields
    if (typeof response.data.success === 'undefined') {
      response.data.success = true;
    }
    
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        response: {
          data: {
            success: false,
            data: null,
            message: 'Network error. Please check your connection.'
          }
        }
      });
    }
    
    // Handle server errors with consistent format
    if (error.response.data && typeof error.response.data === 'object') {
      // Ensure error response has proper structure
      if (typeof error.response.data.success === 'undefined') {
        error.response.data.success = false;
      }
      if (!error.response.data.message) {
        error.response.data.message = 'An error occurred';
      }
      if (typeof error.response.data.data === 'undefined') {
        error.response.data.data = null;
      }
    } else {
      // Fallback for malformed error responses
      error.response.data = {
        success: false,
        data: null,
        message: 'Server error occurred'
      };
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axios;
