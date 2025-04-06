import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true
});

// Keep track of refresh requests to prevent duplicates
let isRefreshing = false;
let failedQueue = [];

// Process the failed queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const { data } = await axiosInstance.post('/auth/refresh-token', {}, { 
          withCredentials: true 
        });
        
        useAuthStore.getState().setAuth(data);
        
        // Process all queued requests
        processQueue(null);
        isRefreshing = false;
        
        // Return a new request with the original config
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject all queued requests
        processQueue(refreshError);
        isRefreshing = false;
        
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);