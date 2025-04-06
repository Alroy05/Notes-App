import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true
}) 

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post('/auth/refresh-token', {}, { 
          withCredentials: true 
        });
        useAuthStore.getState().setAuth(data);
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
