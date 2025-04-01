import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';
import { X, Tag, Palette } from 'lucide-react';
import FormInput from '../common/FormInput';

const colors = [
  '#ffffff', '#fef08a', '#fed7aa', '#bbf7d0', 
  '#bfdbfe', '#e9d5ff', '#fecaca', '#d1d5db'
];

export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, getNote, createNote, updateNote } = useNotesStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#ffffff',
    isPinned: false
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      getNote(id);
    }
  }, [id, getNote]);

  useEffect(() => {
    if (id && currentNote) {
      setFormData({
        title: currentNote.title,
        content: currentNote.content,
        tags: currentNote.tags || [],
        color: currentNote.color || '#ffffff',
        isPinned: currentNote.isPinned || false
      });
    }
  }, [id, currentNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateNote(id, formData);
      } else {
        await createNote(formData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border rounded-md p-2 min-h-[200px] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                className="pl-10 pr-3 py-2 border rounded-md w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a tag and press Enter"
              />
            </div>
            <button
              type="button"
              onClick={handleTagAdd}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-blue-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="isPinned"
            name="isPinned"
            type="checkbox"
            checked={formData.isPinned}
            onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Pin this note
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {id ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
}