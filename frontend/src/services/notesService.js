import { axiosInstance } from '../lib/axios';

export const fetchNotes = async () => {
  const response = await axiosInstance.get('/notes');
  return response.data;
};

export const getNote = async (id) => {
  const response = await axiosInstance.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await axiosInstance.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axiosInstance.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};

export const togglePin = async (id) => {
  const response = await axiosInstance.patch(`/notes/${id}/pin`);
  return response.data;
};