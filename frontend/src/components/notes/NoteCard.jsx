import { motion } from 'framer-motion';
import { Edit, Trash2, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';

export default function NoteCard({ note }) {
  const { deleteNote, togglePin } = useNotesStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        note.color !== '#ffffff' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
      }`}
      style={{ backgroundColor: note.color }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{note.title}</h3>
          <button 
            onClick={() => togglePin(note._id)}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full"
          >
            <Pin 
              className={note.isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} 
              size={18} 
            />
          </button>
        </div>
        <p className="text-sm mb-4 line-clamp-3">{note.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {note.tags?.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-black bg-opacity-10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <Link 
              to={`/notes/${note._id}/edit`} 
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full"
            >
              <Edit size={16} />
            </Link>
            <button 
              onClick={() => deleteNote(note._id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}