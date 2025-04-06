import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useNotesStore = create((set) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTag: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/notes');
      set({ notes: data.notes });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notes' });
    } finally {
      set({ isLoading: false });
    }
  },

  getNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/notes/${id}`);
      set({ currentNote: data });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch note' });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post('/notes', noteData);
      set((state) => ({ notes: [data, ...state.notes] }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (id, noteData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/notes/${id}`, noteData);
      set((state) => ({
        notes: state.notes.map((note) => 
          note._id === id ? data : note
        ),
        currentNote: data
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        currentNote: null
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  togglePin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.patch(`/notes/${id}/pin`);
      set((state) => ({
        notes: state.notes.map((note) => 
          note._id === id ? data : note
        ),
        currentNote: data
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to toggle pin' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedTag: (tag) => set({ selectedTag: tag }),

  getFilteredNotes: () => {
    return useNotesStore.getState().notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(
        useNotesStore.getState().searchQuery.toLowerCase()
      ) || note.content.toLowerCase().includes(
        useNotesStore.getState().searchQuery.toLowerCase()
      );
      
      const matchesTag = useNotesStore.getState().selectedTag 
        ? note.tags?.includes(useNotesStore.getState().selectedTag)
        : true;
      
      return matchesSearch && matchesTag;
    });
  }
}));