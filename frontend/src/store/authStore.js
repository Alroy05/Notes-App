import { create } from 'zustand';
import axios from 'axios';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password }, { 
            withCredentials: true 
          });
          set({ user: data, isAuthenticated: true });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      signup: async ({ fullName, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('http://localhost:5001/api/auth/signup', { 
            fullName, 
            email, 
            password 
          }, { 
            withCredentials: true 
          });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Signup failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        try {
          await axios.post('http://localhost:5001/api/auth/logout', {}, { withCredentials: true });
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
      
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get('http://localhost:5001/api/auth/check', { 
            withCredentials: true 
          });
          set({ user: data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);