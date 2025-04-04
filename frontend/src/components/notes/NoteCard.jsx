import { motion } from 'framer-motion';
import { Edit, Trash2, Pin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';
import { useThemeStore } from '../../store/themeStore';
import { toast } from 'react-hot-toast';

export default function NoteCard({ note }) {
  const { deleteNote, togglePin } = useNotesStore();
  const { theme } = useThemeStore();
  
  // Function to determine if a color is light or dark
  const isLightColor = (color) => {
    // Simple check for "light" colors
    return ['#ffffff', '#fef08a', '#fed7aa', '#bbf7d0', '#bfdbfe', '#e9d5ff'].includes(color);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note._id);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };
  
  const handleTogglePin = async () => {
    try {
      await togglePin(note._id);
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`
        rounded-xl overflow-hidden border backdrop-filter backdrop-blur-md shadow-md
        transition-all duration-300 h-full
        ${note.color === '#ffffff' 
          ? theme === 'dark' 
            ? 'bg-gray-800/70 border-gray-700/50 text-white' 
            : 'bg-white/70 border-gray-200/50 text-gray-800'
          : `border-${note.color.substring(1)}-200/50`
        }
      `}
      style={{ 
        backgroundColor: note.color !== '#ffffff' 
          ? `${note.color}${theme === 'dark' ? 'cc' : '99'}` // Adding transparency
          : undefined
      }}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-lg truncate ${!isLightColor(note.color) ? 'text-white' : ''}`}>
            {note.title}
          </h3>
          <button 
            onClick={handleTogglePin}
            className={`
              p-1.5 rounded-full transition-all duration-200
              ${note.isPinned 
                ? 'bg-yellow-400/20' 
                : note.color === '#ffffff'
                  ? theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200/70'
                  : 'hover:bg-black/10'}
            `}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin 
              className={`
                ${note.isPinned 
                  ? 'text-yellow-400' 
                  : note.color === '#ffffff'
                    ? theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    : isLightColor(note.color) ? 'text-gray-500' : 'text-white/70'
                }
              `}
              size={18} 
              fill={note.isPinned ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        
        <p className={`
          text-sm mb-4 line-clamp-3 flex-grow
          ${!isLightColor(note.color) ? 'text-white/90' : ''}
        `}>
          {note.content}
        </p>
        
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.map((tag) => (
              <span 
                key={tag} 
                className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${note.color === '#ffffff'
                    ? theme === 'dark'
                      ? 'bg-gray-700/70 text-gray-300'
                      : 'bg-gray-200/70 text-gray-700'
                    : isLightColor(note.color)
                      ? 'bg-black/10 text-gray-800'
                      : 'bg-white/20 text-white'}
                `}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-end items-center space-x-1 mt-auto pt-2">
          <Link 
            to={`/notes/${note._id}`}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${note.color === '#ffffff'
                ? theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200/70'
                : 'hover:bg-black/10'}
            `}
          >
            <Calendar size={16} className={!isLightColor(note.color) ? 'text-white/80' : ''} />
          </Link>
          <Link 
            to={`/notes/${note._id}/edit`} 
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${note.color === '#ffffff'
                ? theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200/70'
                : 'hover:bg-black/10'}
            `}
          >
            <Edit size={16} className={!isLightColor(note.color) ? 'text-white/80' : ''} />
          </Link>
          <button 
            onClick={handleDelete}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${note.color === '#ffffff'
                ? theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-100/70'
                : 'hover:bg-black/10'}
              ${note.color === '#ffffff'
                ? theme === 'dark' ? 'hover:text-red-400' : 'hover:text-red-500'
                : 'hover:text-red-300'}
            `}
            aria-label="Delete note"
          >
            <Trash2 size={16} className={!isLightColor(note.color) ? 'text-white/80' : ''} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}