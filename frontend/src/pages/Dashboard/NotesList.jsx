import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, NotebookPen, Tag } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import { useThemeStore } from '../../store/themeStore';
import NoteCard from '../../components/notes/NoteCard';

export default function NotesList() {
  const { 
    notes, 
    isLoading, 
    error, 
    fetchNotes, 
    searchQuery, 
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    getFilteredNotes 
  } = useNotesStore();
  
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className={`
      text-center py-8 px-4 m-6 rounded-lg border
      ${theme === 'dark' 
        ? 'bg-red-900/20 text-red-400 border-red-700/50' 
        : 'bg-red-50 text-red-500 border-red-200'}
    `}>
      <p>Error: {error}</p>
      <button 
        onClick={fetchNotes}
        className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );

  const filteredNotes = getFilteredNotes();

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className={`
          text-2xl font-bold flex items-center
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
        `}>
          <NotebookPen className="mr-2 text-blue-500" /> 
          My Notes
        </h1>
        
        <Link
          to="/notes/new"
          className={`
            flex items-center px-4 py-2 rounded-lg shadow-md 
            ${theme === 'dark' 
              ? 'bg-blue-600/90 hover:bg-blue-700/90 text-white' 
              : 'bg-blue-500/90 hover:bg-blue-600/90 text-white'}
            backdrop-filter backdrop-blur-sm
            transition-all duration-200
          `}
        >
          <Plus size={20} className="mr-2" /> New Note
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${theme === 'dark'
                ? 'bg-gray-800/70 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500'}
              backdrop-filter backdrop-blur-sm border
              transition-all duration-200
            `}
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Tag size={16} className={`mr-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <h2 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by Tags
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`
                px-3 py-1 rounded-full text-sm border
                transition-all duration-200
                ${!selectedTag 
                  ? theme === 'dark' 
                    ? 'bg-blue-600/90 text-white border-blue-500/50' 
                    : 'bg-blue-500/90 text-white border-blue-400/50'
                  : theme === 'dark'
                    ? 'bg-gray-800/70 text-gray-300 border-gray-700/50 hover:bg-gray-700/70'
                    : 'bg-white/70 text-gray-700 border-gray-200/50 hover:bg-gray-100/70'
                }
                backdrop-filter backdrop-blur-sm
              `}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm border
                  transition-all duration-200
                  ${selectedTag === tag 
                    ? theme === 'dark' 
                      ? 'bg-blue-600/90 text-white border-blue-500/50' 
                      : 'bg-blue-500/90 text-white border-blue-400/50'
                    : theme === 'dark'
                      ? 'bg-gray-800/70 text-gray-300 border-gray-700/50 hover:bg-gray-700/70'
                      : 'bg-white/70 text-gray-700 border-gray-200/50 hover:bg-gray-100/70'
                  }
                  backdrop-filter backdrop-blur-sm
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className={`
          text-center py-16 px-6 rounded-xl
          ${theme === 'dark' 
            ? 'bg-gray-800/50 text-gray-400' 
            : 'bg-white/50 text-gray-500'}
          backdrop-filter backdrop-blur-sm
          border
          ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}
        `}>
          <p>
            {searchQuery || selectedTag 
              ? 'No notes match your search' 
              : 'You have no notes yet. Create your first note!'}
          </p>
          {!(searchQuery || selectedTag) && (
            <Link
              to="/notes/new"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <Plus size={16} className="mr-2" /> Create Note
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes
            .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
            .map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
        </div>
      )}
    </div>
  );
}