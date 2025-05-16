import api from './api';

/**
 * Refreshes the access token using the HttpOnly refresh token cookie
 */
export const refreshAccessToken = async () => {
  try {
    const response = await api.post('auth/refresh-token', {}, {
      withCredentials: true // Important for sending cookies
    });
    
    if (response.data.success) {
      const newAccessToken = response.data.data.accessToken;
      
      // Update stored token
      localStorage.setItem('accessToken', newAccessToken);
      
      // Update axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

/**
 * Setup axios interceptor to handle token refresh on 401 errors
 */
export const setupAuthInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh the token
        const refreshed = await refreshAccessToken();
        
        if (refreshed) {
          // Retry the original request
          return api(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
};