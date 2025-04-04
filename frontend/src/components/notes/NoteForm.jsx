import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';
import { useThemeStore } from '../../store/themeStore';
import { X, Tag, Palette, Pin, Save, ArrowLeft } from 'lucide-react';
import FormInput from '../common/FormInput';
import { toast } from 'react-hot-toast';

const colors = [
  '#ffffff', '#fef08a', '#fed7aa', '#bbf7d0', 
  '#bfdbfe', '#e9d5ff', '#fecaca', '#d1d5db'
];

export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, getNote, createNote, updateNote } = useNotesStore();
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#ffffff',
    isPinned: false
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      if (id) {
        await updateNote(id, formData);
        toast.success('Note updated successfully');
      } else {
        await createNote(formData);
        toast.success('Note created successfully');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`
          p-6 rounded-xl
          ${theme === 'dark' 
            ? 'bg-gray-800/70 border border-gray-700/50' 
            : 'bg-white/70 border border-gray-200/50'}
          backdrop-filter backdrop-blur-md shadow-lg
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {id ? 'Edit Note' : 'Create New Note'}
            </h2>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPinned: !formData.isPinned }))}
              className={`
                p-2 rounded-full transition-all duration-200
                ${formData.isPinned ? 'bg-yellow-400/20' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
              `}
              aria-label="Pin note"
            >
              <Pin 
                className={formData.isPinned ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} 
                size={20} 
                fill={formData.isPinned ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="mt-4">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`
                w-full border rounded-lg p-3 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-700 text-white' 
                  : 'bg-white/50 border-gray-300 text-gray-900'}
                backdrop-filter backdrop-blur-sm
                transition-all duration-200
              `}
              required
            />
          </div>

          <div className="mt-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Tags
            </label>
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className={theme === 'dark' ? 'h-5 w-5 text-gray-400' : 'h-5 w-5 text-gray-500'} />
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  className={`
                    pl-10 pr-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${theme === 'dark' 
                      ? 'bg-gray-900/50 border-gray-700 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'}
                    backdrop-filter backdrop-blur-sm
                    transition-all duration-200
                  `}
                  placeholder="Add a tag and press Enter"
                />
              </div>
              <button
                type="button"
                onClick={handleTagAdd}
                className={`
                  ml-2 px-4 py-2 rounded-lg 
                  ${theme === 'dark' 
                    ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
                    : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'}
                  transition-all duration-200 backdrop-filter backdrop-blur-sm
                `}
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${theme === 'dark' 
                      ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' 
                      : 'bg-blue-100/80 text-blue-800 border border-blue-200/50'}
                    backdrop-filter backdrop-blur-sm
                  `}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className={`
                      ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full 
                      ${theme === 'dark' 
                        ? 'hover:bg-blue-800 text-blue-300' 
                        : 'hover:bg-blue-200 text-blue-600'}
                    `}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Color
            </label>
            <div className="flex items-center space-x-3">
              <Palette className={theme === 'dark' ? 'h-5 w-5 text-gray-400' : 'h-5 w-5 text-gray-500'} />
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all duration-200
                      ${formData.color === color 
                        ? 'border-blue-500 scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'}
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`
              flex items-center px-4 py-2 rounded-lg transition-all duration-200
              ${theme === 'dark' 
                ? 'bg-gray-800/70 border border-gray-700/50 text-gray-300 hover:bg-gray-700/70' 
                : 'bg-white/70 border border-gray-200/50 text-gray-700 hover:bg-gray-100/70'}
              backdrop-filter backdrop-blur-sm
            `}
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              flex items-center px-6 py-2 rounded-lg transition-all duration-200
              ${theme === 'dark' 
                ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
                : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'}
              backdrop-filter backdrop-blur-sm
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <Save size={18} className="mr-2" />
            {isSubmitting 
              ? 'Saving...' 
              : id ? 'Update Note' : 'Create Note'
            }
          </button>
        </div>
      </form>
    </div>
  );
}