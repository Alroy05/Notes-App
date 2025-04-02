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
      activeSessions: [],
      
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
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get('/api/users/me');
          set({ user: data });
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.put('/api/users/me', profileData);
          set({ user: data });
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to update profile';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },
      
      getActiveSessions: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get('/api/users/me/sessions');
          set({ activeSessions: data });
        } catch (error) {
          console.error('Failed to get sessions:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      revokeSession: async (sessionId) => {
        set({ isLoading: true });
        try {
          await axios.delete(`/api/users/me/sessions/${sessionId}`);
          set((state) => ({
            activeSessions: state.activeSessions.filter(
              (session) => session._id !== sessionId
            )
          }));
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to revoke session';
          throw new Error(message);
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