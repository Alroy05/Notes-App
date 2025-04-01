import axios from './api';

export const fetchNotes = async () => {
  const response = await axios.get('/notes');
  return response.data;
};

export const getNote = async (id) => {
  const response = await axios.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await axios.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axios.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`/notes/${id}`);
  return response.data;
};

export const togglePin = async (id) => {
  const response = await axios.patch(`/notes/${id}/pin`);
  return response.data;
};