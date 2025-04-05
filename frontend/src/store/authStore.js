import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useAuthStore = create(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      activeSessions: [],
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosInstance.post('/auth/login', { email, password });
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
          const { data } = await axiosInstance.post('/auth/signup', { 
            fullName, 
            email, 
            password 
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
          await axiosInstance.post('/auth/logout');
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout failed:', error);
          set({ error: error.response?.data?.message || 'Logout failed' });
          throw error;
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
      
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get('/auth/check');
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
          const { data } = await axiosInstance.get('/users/me');
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
          const { data } = await axiosInstance.put('/users/me', profileData);
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

      deleteAccount: async (password) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete('/users/me', { 
            data: { password } 
          });
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to delete account';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      changePassword: async ({ currentPassword,newPassword }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosInstance.put('/users/me/password', { currentPassword, newPassword });
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
          const { data } = await axiosInstance.get('/users/me/sessions');
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
          await axiosInstance.delete(`/users/me/sessions/${sessionId}`);
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
    })
    ,
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
);